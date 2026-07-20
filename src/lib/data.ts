import { prisma } from "@/lib/prisma";

export function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function getBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}

export function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    include: { images: true, category: true, brand: true },
    take: 8,
  });
}

export function getAllProducts() {
  return prisma.product.findMany({
    where: { active: true },
    include: { images: true, category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true, brand: true, reviews: true },
  });
}

export function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, active: true, id: { not: excludeId } },
    include: { images: true },
    take: 4,
  });
}
