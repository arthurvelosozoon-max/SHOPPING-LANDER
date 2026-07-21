"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createCoupon(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "PERCENT");
  const value = Number(formData.get("value"));
  const minOrderRaw = String(formData.get("minOrder") ?? "").trim();
  const usageLimitRaw = String(formData.get("usageLimit") ?? "").trim();
  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();

  if (!code || Number.isNaN(value)) return;

  await prisma.coupon.create({
    data: {
      code,
      type: type as never,
      value,
      minOrder: minOrderRaw ? Number(minOrderRaw) : null,
      usageLimit: usageLimitRaw ? Number(usageLimitRaw) : null,
      expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
      active: true,
    },
  });

  revalidatePath("/admin/cupons");
}

export async function toggleCoupon(id: string, active: boolean) {
  await prisma.coupon.update({ where: { id }, data: { active } });
  revalidatePath("/admin/cupons");
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/cupons");
}
