import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Novo",
  PAID: "Pago",
  PACKING: "Separação",
  SHIPPED: "Enviado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolso",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Pedidos</h1>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Itens</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/40">
                  Nenhum pedido registrado ainda.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5 text-white/80">
                <td className="p-4 font-mono text-xs text-white/50">{o.id.slice(0, 8)}</td>
                <td className="p-4">{o.user.name}</td>
                <td className="p-4">{o.items.length}</td>
                <td className="p-4">
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-bold text-white">
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-sl-red">
                  {formatCurrency(o.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
