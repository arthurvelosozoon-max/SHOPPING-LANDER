import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";
import { deleteProduct } from "./actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: true, category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 rounded-lg bg-sl-red px-4 py-2 text-sm font-bold text-white hover:bg-sl-red-glow"
        >
          <Plus size={16} /> Novo Produto
        </Link>
      </div>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Produto</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-white/40">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 text-white/80">
                <td className="flex items-center gap-3 p-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-white/5">
                    <Image
                      src={p.images[0]?.url ?? "/placeholder-product.svg"}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="max-w-[220px] truncate">{p.name}</span>
                </td>
                <td className="p-4 text-white/50">{p.sku}</td>
                <td className="p-4">{p.category.name}</td>
                <td className="p-4">{formatCurrency(p.salePrice ?? p.price)}</td>
                <td className="p-4">
                  <span className={p.stock <= p.minStock ? "text-sl-red font-bold" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      p.active ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/produtos/${p.id}/editar`}
                      className="text-white/50 hover:text-sl-red"
                      aria-label="Editar"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteIconButton
                      itemName={p.name}
                      action={deleteProduct.bind(null, p.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
