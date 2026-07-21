"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { applyStockDelta } from "@/lib/stock";

export async function adjustStock(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const newStock = Number(formData.get("newStock"));
  const reason = String(formData.get("reason") ?? "").trim() || "Ajuste manual";

  if (!productId || Number.isNaN(newStock) || newStock < 0) return;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  const delta = newStock - product.stock;
  if (delta === 0) return;

  await prisma.$transaction(async (tx) => {
    await applyStockDelta(tx, {
      productId,
      delta,
      type: "ADJUST",
      reason,
      adminEmail: session?.email,
    });
  });

  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
  revalidatePath("/produtos");
}
