import Link from "next/link";
import { getAllProducts, getCategories, getBrands } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";

type SearchParams = Promise<{ categoria?: string; marca?: string; promo?: string }>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { categoria, marca, promo } = await searchParams;
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getBrands(),
  ]);

  const filtered = products.filter((p) => {
    if (categoria && p.category.slug !== categoria) return false;
    if (marca && p.brand?.slug !== marca) return false;
    if (promo === "1" && !p.salePrice) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-white">
        {promo === "1" ? "Ofertas do Dia" : "Todos os Produtos"}
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-8">
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/50">
              Categorias
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/produtos"
                  className={`text-sm ${!categoria ? "text-sl-red font-bold" : "text-white/70 hover:text-sl-red"}`}
                >
                  Todas
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/produtos?categoria=${c.slug}`}
                    className={`text-sm ${categoria === c.slug ? "text-sl-red font-bold" : "text-white/70 hover:text-sl-red"}`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/50">
              Marcas
            </h2>
            <ul className="space-y-2">
              {brands.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/produtos?marca=${b.slug}`}
                    className={`text-sm ${marca === b.slug ? "text-sl-red font-bold" : "text-white/70 hover:text-sl-red"}`}
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <p className="text-white/50">Nenhum produto encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
