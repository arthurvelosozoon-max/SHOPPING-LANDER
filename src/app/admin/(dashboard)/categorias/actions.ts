"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

function revalidateStorefront() {
  // Header (with the Categorias dropdown) is fetched once in the shared
  // (site) layout, so a plain page revalidation isn't enough to refresh it.
  revalidatePath("/", "layout");
  revalidatePath("/admin/categorias");
  revalidatePath("/produtos");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.category.create({ data: { name, slug: slugify(name) } });
  revalidateStorefront();
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem produtos nessa categoria.");
  }
  revalidateStorefront();
}

export async function createBrand(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.brand.create({ data: { name, slug: slugify(name) } });
  revalidateStorefront();
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem produtos dessa marca.");
  }
  revalidateStorefront();
}
