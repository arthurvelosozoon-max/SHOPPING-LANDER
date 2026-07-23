"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { createSignedUploadUrl } from "@/lib/supabase-storage";

export type ProductFormState = { error?: string };

const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/**
 * Returns a short-lived signed upload URL/token for the browser to upload
 * the actual file bytes directly to Supabase Storage — the file itself
 * never passes through this Server Action, so it isn't subject to the
 * Netlify function payload limit.
 */
export async function requestProductImageUpload(
  fileType: string,
  fileSize: number
): Promise<{ token?: string; path?: string; publicUrl?: string; error?: string }> {
  if (fileSize <= 0) {
    return { error: "Selecione um arquivo de imagem." };
  }
  if (fileSize > MAX_IMAGE_BYTES) {
    return { error: "Imagem muito grande (máximo 25MB)." };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
    return { error: "Formato não suportado. Use PNG, JPG, WEBP, GIF ou SVG." };
  }

  try {
    const { token, path, publicUrl } = await createSignedUploadUrl(ALLOWED_EXTENSIONS[fileType]);
    return { token, path, publicUrl };
  } catch {
    return { error: "Falha ao preparar o envio da imagem. Tente novamente." };
  }
}

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
  const salePriceNumber = salePriceRaw ? Number(salePriceRaw) : null;
  // A promotional price of 0 (or a typo like a negative number) is treated
  // as "no promotion" rather than "free" — `?? ` fallbacks elsewhere in the
  // app only skip null/undefined, so a stored 0 would render as R$ 0,00.
  const salePrice =
    salePriceNumber !== null && !Number.isNaN(salePriceNumber) && salePriceNumber > 0
      ? salePriceNumber
      : null;
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
      salePrice,
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
