import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { formatCurrency, discountPercent } from "@/lib/format";
import { ProductCard } from "@/components/product/product-card";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { RequestQuoteButton } from "@/components/product/request-quote-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const discount = discountPercent(product.price, product.salePrice);
  const finalPrice = product.salePrice ?? product.price;
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5 sl-card">
          <Image
            src={product.images[0]?.url ?? "/placeholder-product.svg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-sl-red px-3 py-1 text-sm font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>

        <div>
          <p className="text-sm text-sl-red font-bold uppercase tracking-wide">
            {product.category.name} {product.brand ? `· ${product.brand.name}` : ""}
          </p>
          <h1 className="mt-2 text-3xl font-black text-white">{product.name}</h1>

          {product.reviews.length > 0 && (
            <p className="mt-2 text-sm text-white/50">
              ★ {avgRating.toFixed(1)} ({product.reviews.length} avaliações)
            </p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            {discount > 0 && (
              <span className="text-lg text-white/40 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-4xl font-black text-sl-red">{formatCurrency(finalPrice)}</span>
          </div>

          <p className="mt-2 text-sm text-white/50">
            {product.stock > 0 ? `${product.stock} em estoque` : "Fora de estoque"}
          </p>

          <p className="mt-6 text-white/70 leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: finalPrice,
                salePrice: product.salePrice,
                image: product.images[0]?.url ?? "/placeholder-product.svg",
              }}
              disabled={product.stock <= 0}
            />
          </div>

          <div className="mt-4">
            <RequestQuoteButton productName={product.name} />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
            <div>
              <dt className="text-white/40">SKU</dt>
              <dd className="text-white">{product.sku}</dd>
            </div>
            {product.weight && (
              <div>
                <dt className="text-white/40">Peso</dt>
                <dd className="text-white">{product.weight} kg</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-black text-white">Produtos Relacionados</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  price: p.price,
                  salePrice: p.salePrice,
                  image: p.images[0]?.url ?? "/placeholder-product.svg",
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
