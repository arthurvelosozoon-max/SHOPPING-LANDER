import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Zap } from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";

export default async function Home() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <div>
      <section className="relative overflow-hidden sl-scanline-bg py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-sl-red/50 bg-sl-red/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-sl-red">
              Alta Performance
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] text-white lg:text-7xl">
              FORÇA. <span className="text-sl-red sl-glow-text">VELOCIDADE.</span> RESULTADO.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/60">
              Suplementos, moda fitness, acessórios e eletrônicos esportivos com curadoria premium
              para quem não aceita menos que o topo.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/produtos"
                className="flex items-center gap-2 rounded-lg bg-sl-red px-6 py-3 font-bold text-white transition hover:bg-sl-red-glow sl-red-glow"
              >
                Ver Produtos <ArrowRight size={18} />
              </Link>
              <Link
                href="/produtos?promo=1"
                className="flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-bold text-white transition hover:border-sl-red hover:text-sl-red"
              >
                Ofertas do Dia
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-sl-black-soft py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Truck className="text-sl-red" />
            <span className="text-sm text-white/70">Entregamos em todo o Brasil e Paraguai</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-sl-red" />
            <span className="text-sm text-white/70">Compra 100% segura</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="text-sl-red" />
            <span className="text-sm text-white/70">Produtos originais e certificados</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="mb-6 text-2xl font-black text-white">Categorias</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/produtos?categoria=${c.slug}`}
              className="sl-card group flex h-28 items-center justify-center rounded-xl text-center transition hover:border-sl-red/50"
            >
              <span className="font-bold text-white group-hover:text-sl-red">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">Produtos em Destaque</h2>
          <Link href="/produtos" className="text-sm font-bold text-sl-red hover:text-sl-red-glow">
            Ver tudo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
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
    </div>
  );
}
