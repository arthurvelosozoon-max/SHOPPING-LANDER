"use server";

import { prisma } from "@/lib/prisma";

export type TrackedOrder = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: Date;
  total: number;
  carrier: string | null;
  trackingCode: string | null;
  trackingUrl: string | null;
  shippedAt: Date | null;
  estimatedDelivery: Date | null;
  shippingNotes: string | null;
  items: { productName: string; quantity: number; price: number }[];
};

export async function trackOrder(query: string): Promise<TrackedOrder[]> {
  const cleaned = query.trim();
  if (!cleaned) return [];

  const digitsOnly = cleaned.replace(/\D/g, "");
  const isLikelyCpf = digitsOnly.length >= 11;

  const orders = await prisma.order.findMany({
    where: isLikelyCpf
      ? { customerCpf: digitsOnly }
      : { orderNumber: { equals: cleaned, mode: "insensitive" } },
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    createdAt: o.createdAt,
    total: o.total,
    carrier: o.carrier,
    trackingCode: o.trackingCode,
    trackingUrl: o.trackingUrl,
    shippedAt: o.shippedAt,
    estimatedDelivery: o.estimatedDelivery,
    shippingNotes: o.shippingNotes,
    items: o.items.map((i) => ({
      productName: i.product.name,
      quantity: i.quantity,
      price: i.price,
    })),
  }));
}
