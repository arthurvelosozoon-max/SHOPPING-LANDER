import type { Prisma } from "@/generated/prisma/client";

type TxClient = Prisma.TransactionClient;

export type StockMovementType = "IN" | "OUT" | "ADJUST";

/**
 * Adjusts a product's stock inside a transaction and logs a StockMovement.
 * `delta` is signed: positive increases stock (IN), negative decreases it (OUT).
 */
export async function applyStockDelta(
  tx: TxClient,
  params: {
    productId: string;
    delta: number;
    type: StockMovementType;
    reason?: string;
    orderId?: string;
    adminEmail?: string;
  }
) {
  const { productId, delta, type, reason, orderId, adminEmail } = params;
  if (delta === 0) return;

  const product = await tx.product.findUniqueOrThrow({ where: { id: productId } });
  const previousStock = product.stock;
  const newStock = previousStock + delta;

  await tx.product.update({ where: { id: productId }, data: { stock: newStock } });

  await tx.stockMovement.create({
    data: {
      productId,
      type,
      quantity: Math.abs(delta),
      previousStock,
      newStock,
      reason,
      orderId,
      adminEmail,
    },
  });
}

/**
 * Given the old and new item lists for an order, computes the net stock delta
 * per product and applies it. Used for both order creation (oldItems = [])
 * and order editing (oldItems = previous OrderItems).
 */
export async function syncStockForOrderItems(
  tx: TxClient,
  params: {
    orderId: string;
    orderNumber: string;
    oldItems: { productId: string; quantity: number }[];
    newItems: { productId: string; quantity: number }[];
    adminEmail?: string;
  }
) {
  const { orderId, orderNumber, oldItems, newItems, adminEmail } = params;

  const productIds = new Set([
    ...oldItems.map((i) => i.productId),
    ...newItems.map((i) => i.productId),
  ]);

  for (const productId of productIds) {
    const oldQty = oldItems.find((i) => i.productId === productId)?.quantity ?? 0;
    const newQty = newItems.find((i) => i.productId === productId)?.quantity ?? 0;
    const diff = newQty - oldQty;
    if (diff === 0) continue;

    await applyStockDelta(tx, {
      productId,
      delta: -diff,
      type: diff > 0 ? "OUT" : "IN",
      reason: `Pedido ${orderNumber}`,
      orderId,
      adminEmail,
    });
  }
}

/** Restores stock for all items of a deleted order. */
export async function restoreStockForDeletedOrder(
  tx: TxClient,
  params: {
    orderNumber: string;
    items: { productId: string; quantity: number }[];
    adminEmail?: string;
  }
) {
  const { orderNumber, items, adminEmail } = params;
  for (const item of items) {
    await applyStockDelta(tx, {
      productId: item.productId,
      delta: item.quantity,
      type: "IN",
      reason: `Exclusão do pedido ${orderNumber}`,
      adminEmail,
    });
  }
}
