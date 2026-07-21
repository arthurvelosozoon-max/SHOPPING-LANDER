import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";
import { createCategory, deleteCategory, createBrand, deleteBrand } from "./actions";

export default async function AdminCategoriesPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Categorias &amp; Marcas</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="sl-card rounded-xl p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Categorias</h2>
          <form action={createCategory} className="mb-6 flex gap-2">
            <input
              name="name"
              placeholder="Nome da categoria"
              required
              className="admin-input"
            />
            <button className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-sl-red px-4 py-2 text-sm font-bold text-white hover:bg-sl-red-glow">
              <Plus size={16} /> Adicionar
            </button>
          </form>

          <ul className="space-y-2">
            {categories.length === 0 && (
              <p className="text-sm text-white/40">Nenhuma categoria cadastrada.</p>
            )}
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80"
              >
                <span>
                  {c.name}{" "}
                  <span className="text-white/40">({c._count.products} produtos)</span>
                </span>
                <DeleteIconButton itemName={c.name} action={deleteCategory.bind(null, c.id)} />
              </li>
            ))}
          </ul>
        </section>

        <section className="sl-card rounded-xl p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Marcas</h2>
          <form action={createBrand} className="mb-6 flex gap-2">
            <input name="name" placeholder="Nome da marca" required className="admin-input" />
            <button className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-sl-red px-4 py-2 text-sm font-bold text-white hover:bg-sl-red-glow">
              <Plus size={16} /> Adicionar
            </button>
          </form>

          <ul className="space-y-2">
            {brands.length === 0 && (
              <p className="text-sm text-white/40">Nenhuma marca cadastrada.</p>
            )}
            {brands.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80"
              >
                <span>
                  {b.name} <span className="text-white/40">({b._count.products} produtos)</span>
                </span>
                <DeleteIconButton itemName={b.name} action={deleteBrand.bind(null, b.id)} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
