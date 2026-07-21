"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export type ProductFormState = { error?: string };

function parseImages(formData: FormData) {
  const raw = String(formData.get("images") ?? "");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseProductInput(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const salePriceRaw = String(formData.get("salePrice") ?? "").trim();
  const salePrice = salePriceRaw ? Number(salePriceRaw) : null;
  const stock = Number(formData.get("stock") ?? 0);
  const minStock = Number(formData.get("minStock") ?? 5);
  const weightRaw = String(formData.get("weight") ?? "").trim();
  const weight = weightRaw ? Number(weightRaw) : null;
  const categoryId = String(formData.get("categoryId") ?? "");
  const brandIdRaw = String(formData.get("brandId") ?? "");
  const brandId = brandIdRaw || null;
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  const images = parseImages(formData);

  if (!name || !sku || !description || !categoryId || Number.isNaN(price)) {
    return { error: "Preencha nome, SKU, descrição, preço e categoria." } as const;
  }

  return {
    data: {
      name,
      slug: slugify(name),
      sku,
      description,
      price,
      salePrice: salePrice !== null && !Number.isNaN(salePrice) ? salePrice : null,
      stock: Number.isNaN(stock) ? 0 : stock,
      minStock: Number.isNaN(minStock) ? 5 : minStock,
      weight: weight !== null && !Number.isNaN(weight) ? weight : null,
      categoryId,
      brandId,
      featured,
      active,
      images,
    },
  } as const;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = parseProductInput(formData);
  if ("error" in parsed) return { error: parsed.error };
  const { images, ...productData } = parsed.data;

  try {
    await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((url, position) => ({ url, position })),
        },
      },
    });
  } catch {
    return { error: "Não foi possível salvar. Verifique se o SKU já existe." };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath("/");
  redirect("/admin/produtos");
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = parseProductInput(formData);
  if ("error" in parsed) return { error: parsed.error };
  const { images, ...productData } = parsed.data;

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
        images: {
          deleteMany: {},
          create: images.map((url, position) => ({ url, position })),
        },
      },
    });
  } catch {
    return { error: "Não foi possível salvar. Verifique se o SKU já existe." };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath("/");
  redirect("/admin/produtos");
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({ where: { id: productId } });
  } catch {
    throw new Error("Não é possível excluir: este produto já possui pedidos ou favoritos vinculados.");
  }
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath("/");
}
