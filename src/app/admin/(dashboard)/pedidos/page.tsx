import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";
import { deleteOrder } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Recebido",
  PAID: "Pago",
  PACKING: "Separando",
  SHIPPED: "Enviado",
  COMPLETED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolso",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400",
  PAID: "bg-blue-500/15 text-blue-400",
  PACKING: "bg-purple-500/15 text-purple-400",
  SHIPPED: "bg-cyan-500/15 text-cyan-400",
  COMPLETED: "bg-green-500/15 text-green-400",
  CANCELLED: "bg-white/10 text-white/40",
  REFUNDED: "bg-sl-red/15 text-sl-red",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Pedidos</h1>
        <Link
          href="/admin/pedidos/novo"
          className="flex items-center gap-2 rounded-lg bg-sl-red px-4 py-2 text-sm font-bold text-white hover:bg-sl-red-glow"
        >
          <Plus size={16} /> Novo Pedido
        </Link>
      </div>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Itens</th>
              <th className="p-4">Pagamento</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-white/40">
                  Nenhum pedido registrado ainda.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5 text-white/80">
                <td className="p-4 font-mono text-xs text-white/50">{o.orderNumber}</td>
                <td className="p-4">
                  <div>{o.customerName}</div>
                  <div className="text-xs text-white/40">{o.customerPhone}</div>
                </td>
                <td className="p-4">{o.items.length}</td>
                <td className="p-4">{o.paymentMethod}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${STATUS_COLOR[o.status] ?? "bg-white/10 text-white/40"}`}
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-sl-red">
                  {formatCurrency(o.total)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/pedidos/${o.id}/editar`}
                      className="text-white/50 hover:text-sl-red"
                      aria-label="Editar"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteIconButton
                      itemName={`pedido ${o.orderNumber}`}
                      action={deleteOrder.bind(null, o.id)}
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
