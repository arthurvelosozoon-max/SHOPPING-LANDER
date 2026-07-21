import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Novo Produto</h1>
      <ProductForm
        action={createProduct}
        categories={categories}
        brands={brands}
        submitLabel="Criar Produto"
      />
    </div>
  );
}
