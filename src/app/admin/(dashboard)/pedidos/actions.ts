"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { syncStockForOrderItems, restoreStockForDeletedOrder } from "@/lib/stock";

export type OrderFormState = { error?: string };

export type OrderItemInput = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

async function getAdminEmail() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  return session?.email;
}

function parseItems(formData: FormData): OrderItemInput[] | null {
  const raw = String(formData.get("itemsJson") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((i) => ({
      productId: String(i.productId),
      name: String(i.name),
      price: Number(i.price),
      quantity: Number(i.quantity),
    }));
  } catch {
    return null;
  }
}

function parseDate(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str ? new Date(str) : null;
}

async function nextOrderNumber() {
  const count = await prisma.order.count();
  return `PED-${String(count + 1).padStart(4, "0")}`;
}

function parseOrderInput(formData: FormData) {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerPhone = String(formData.get("customerPhone") ?? "").trim();
  const customerCpf = String(formData.get("customerCpf") ?? "").replace(/\D/g, "") || null;
  const paymentMethod = String(formData.get("paymentMethod") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "PENDING");
  const carrier = String(formData.get("carrier") ?? "").trim() || null;
  const trackingCode = String(formData.get("trackingCode") ?? "").trim() || null;
  const trackingUrl = String(formData.get("trackingUrl") ?? "").trim() || null;
  const shippedAt = parseDate(formData.get("shippedAt"));
  const estimatedDelivery = parseDate(formData.get("estimatedDelivery"));
  const shippingNotes = String(formData.get("shippingNotes") ?? "").trim() || null;
  const items = parseItems(formData);

  if (!customerName || !customerPhone || !paymentMethod) {
    return { error: "Preencha nome, telefone e forma de pagamento." } as const;
  }
  if (!items) {
    return { error: "Adicione pelo menos um produto ao pedido." } as const;
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    data: {
      customerName,
      customerPhone,
      customerCpf,
      paymentMethod,
      notes,
      status: status as never,
      carrier,
      trackingCode,
      trackingUrl,
      shippedAt,
      estimatedDelivery,
      shippingNotes,
      subtotal,
      total: subtotal,
      items,
    },
  } as const;
}

export async function createOrder(
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const parsed = parseOrderInput(formData);
  if ("error" in parsed) return { error: parsed.error };
  const { items, ...orderData } = parsed.data;

  const adminEmail = await getAdminEmail();
  const orderNumber = await nextOrderNumber();

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product && product.stock < item.quantity) {
      return {
        error: `Estoque insuficiente para "${product.name}" (disponível: ${product.stock}).`,
      };
    }
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        ...orderData,
        orderNumber,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });

    await syncStockForOrderItems(tx, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      oldItems: [],
      newItems: items,
      adminEmail,
    });
  });

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  revalidatePath("/admin/estoque");
  revalidatePath("/admin/clientes");
  revalidatePath("/produtos");
  redirect("/admin/pedidos");
}

export async function updateOrder(
  orderId: string,
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const parsed = parseOrderInput(formData);
  if ("error" in parsed) return { error: parsed.error };
  const { items, ...orderData } = parsed.data;

  const adminEmail = await getAdminEmail();

  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!existingOrder) return { error: "Pedido não encontrado." };

  const oldItems = existingOrder.items.map((i) => ({
    productId: i.productId,
    quantity: i.quantity,
  }));

  for (const item of items) {
    const oldQty = oldItems.find((i) => i.productId === item.productId)?.quantity ?? 0;
    const extraNeeded = item.quantity - oldQty;
    if (extraNeeded <= 0) continue;
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product && product.stock < extraNeeded) {
      return {
        error: `Estoque insuficiente para "${product.name}" (disponível: ${product.stock}).`,
      };
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        ...orderData,
        items: {
          deleteMany: {},
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });

    await syncStockForOrderItems(tx, {
      orderId,
      orderNumber: existingOrder.orderNumber,
      oldItems,
      newItems: items,
      adminEmail,
    });
  });

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  revalidatePath("/admin/estoque");
  revalidatePath("/admin/clientes");
  revalidatePath("/produtos");
  redirect("/admin/pedidos");
}

export async function deleteOrder(orderId: string) {
  const adminEmail = await getAdminEmail();

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return;

  await prisma.$transaction(async (tx) => {
    await restoreStockForDeletedOrder(tx, {
      orderNumber: order.orderNumber,
      items: order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      adminEmail,
    });
    await tx.order.delete({ where: { id: orderId } });
  });

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  revalidatePath("/admin/estoque");
  revalidatePath("/admin/clientes");
  revalidatePath("/produtos");
}
