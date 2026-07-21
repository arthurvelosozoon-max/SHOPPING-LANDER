import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderForm } from "@/components/admin/order-form";
import { updateOrder } from "../../actions";

function toDateInputValue(date: Date | null) {
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, products] = await Promise.all([
    prisma.order.findUnique({ where: { id }, include: { items: true } }),
    prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true, price: true, salePrice: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!order) notFound();

  const boundAction = updateOrder.bind(null, order.id);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">
        Editar Pedido <span className="text-white/40">#{order.orderNumber}</span>
      </h1>
      <OrderForm
        action={boundAction}
        products={products}
        submitLabel="Salvar Alterações"
        initialValues={{
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerCpf: order.customerCpf,
          paymentMethod: order.paymentMethod,
          notes: order.notes,
          status: order.status,
          carrier: order.carrier,
          trackingCode: order.trackingCode,
          trackingUrl: order.trackingUrl,
          shippedAt: toDateInputValue(order.shippedAt),
          estimatedDelivery: toDateInputValue(order.estimatedDelivery),
          shippingNotes: order.shippingNotes,
          items: order.items.map((i) => ({
            productId: i.productId,
            name: products.find((p) => p.id === i.productId)?.name ?? "Produto removido",
            price: i.price,
            quantity: i.quantity,
          })),
        }}
      />
    </div>
  );
}
