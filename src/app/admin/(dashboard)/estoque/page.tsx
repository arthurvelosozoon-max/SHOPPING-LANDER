import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { StockAdjustForm } from "@/components/admin/stock-adjust-form";

const MOVEMENT_LABEL: Record<string, string> = {
  IN: "Entrada",
  OUT: "Saída",
  ADJUST: "Ajuste",
};

const MOVEMENT_COLOR: Record<string, string> = {
  IN: "bg-green-500/15 text-green-400",
  OUT: "bg-sl-red/15 text-sl-red",
  ADJUST: "bg-blue-500/15 text-blue-400",
};

function StatusBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock <= 0) {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-sl-red/15 px-2 py-1 text-xs font-bold text-sl-red">
        🔴 Sem estoque
      </span>
    );
  }
  if (stock <= minStock) {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/15 px-2 py-1 text-xs font-bold text-yellow-400">
        🟡 Estoque baixo
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2 py-1 text-xs font-bold text-green-400">
      🟢 Em estoque
    </span>
  );
}

export default async function AdminStockPage() {
  const [products, movements] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minStock: true,
        price: true,
        category: { select: { name: true } },
      },
      orderBy: { stock: "asc" },
    }),
    prisma.stockMovement.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } }, order: { select: { orderNumber: true } } },
    }),
  ]);

  const totalStockValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Estoque</h1>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="sl-card rounded-xl p-5">
          <span className="text-sm text-white/50">Valor total em estoque</span>
          <p className="mt-2 text-2xl font-black text-white">{formatCurrency(totalStockValue)}</p>
        </div>
        <div className="sl-card rounded-xl p-5">
          <span className="text-sm text-white/50">Estoque baixo</span>
          <p className="mt-2 text-2xl font-black text-yellow-400">{lowStockCount}</p>
        </div>
        <div className="sl-card rounded-xl p-5">
          <span className="text-sm text-white/50">Sem estoque</span>
          <p className="mt-2 text-2xl font-black text-sl-red">{outOfStockCount}</p>
        </div>
      </div>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Produto</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Mínimo</th>
              <th className="p-4">Valor Unit.</th>
              <th className="p-4">Valor Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 text-white/80">
                <td className="p-4">{p.name}</td>
                <td className="p-4 text-white/50">{p.sku}</td>
                <td className="p-4 text-white/50">{p.category.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{p.stock}</span>
                    <StockAdjustForm productId={p.id} stock={p.stock} />
                  </div>
                </td>
                <td className="p-4 text-white/50">{p.minStock}</td>
                <td className="p-4 text-white/50">{formatCurrency(p.price)}</td>
                <td className="p-4">{formatCurrency(p.stock * p.price)}</td>
                <td className="p-4">
                  <StatusBadge stock={p.stock} minStock={p.minStock} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-white">Movimentações Recentes</h2>
        <div className="sl-card overflow-x-auto rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/50">
                <th className="p-4">Produto</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Anterior → Atual</th>
                <th className="p-4">Pedido</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Data</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40">
                    Nenhuma movimentação registrada ainda.
                  </td>
                </tr>
              )}
              {movements.map((m) => (
                <tr key={m.id} className="border-b border-white/5 text-white/80">
                  <td className="p-4">{m.product.name}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${MOVEMENT_COLOR[m.type] ?? "bg-white/10 text-white/40"}`}
                    >
                      {MOVEMENT_LABEL[m.type] ?? m.type}
                    </span>
                  </td>
                  <td className="p-4">{m.quantity}</td>
                  <td className="p-4 text-white/50">
                    {m.previousStock} → {m.newStock}
                  </td>
                  <td className="p-4 text-white/50">{m.order?.orderNumber ?? "—"}</td>
                  <td className="p-4 text-white/50">{m.adminEmail ?? "—"}</td>
                  <td className="p-4 text-white/50">
                    {m.createdAt.toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
