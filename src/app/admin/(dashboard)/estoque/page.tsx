import { prisma } from "@/lib/prisma";

export default async function AdminStockPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true, stock: true, minStock: true },
    orderBy: { stock: "asc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Estoque</h1>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Produto</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Estoque Atual</th>
              <th className="p-4">Estoque Mínimo</th>
              <th className="p-4">Alerta</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const low = p.stock <= p.minStock;
              return (
                <tr key={p.id} className="border-b border-white/5 text-white/80">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4 text-white/50">{p.sku}</td>
                  <td className="p-4 font-bold">{p.stock}</td>
                  <td className="p-4 text-white/50">{p.minStock}</td>
                  <td className="p-4">
                    {low ? (
                      <span className="rounded-full bg-sl-red/15 px-2 py-1 text-xs font-bold text-sl-red">
                        Estoque baixo
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-500/15 px-2 py-1 text-xs font-bold text-green-400">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
