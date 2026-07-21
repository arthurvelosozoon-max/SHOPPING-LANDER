import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const boundAction = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Editar Produto</h1>
      <ProductForm
        action={boundAction}
        categories={categories}
        brands={brands}
        submitLabel="Salvar Alterações"
        initialValues={{
          name: product.name,
          sku: product.sku,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          stock: product.stock,
          minStock: product.minStock,
          weight: product.weight,
          categoryId: product.categoryId,
          brandId: product.brandId,
          featured: product.featured,
          active: product.active,
          images: product.images.sort((a, b) => a.position - b.position).map((i) => i.url),
        }}
      />
    </div>
  );
}
