import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { Package, ShoppingBag, AlertTriangle, DollarSign } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Recebido",
  PAID: "Pago",
  PACKING: "Separando",
  SHIPPED: "Enviado",
  COMPLETED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolso",
};

// Revenue only counts orders that have actually been paid — PENDING orders
// haven't been paid yet, and CANCELLED/REFUNDED shouldn't count as revenue.
const PAID_ONWARD_STATUSES = ["PAID", "PACKING", "SHIPPED", "COMPLETED"] as const;

export default async function AdminDashboard() {
  const [productCount, orderCount, allProducts, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.findMany({ select: { stock: true, minStock: true } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  const lowStockCount = allProducts.filter((p) => p.stock <= p.minStock).length;
  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: [...PAID_ONWARD_STATUSES] } },
  });

  const cards = [
    { label: "Produtos", value: productCount, icon: Package },
    { label: "Pedidos", value: orderCount, icon: ShoppingBag },
    { label: "Receita Total", value: formatCurrency(revenue._sum.total ?? 0), icon: DollarSign },
    { label: "Estoque Baixo", value: lowStockCount, icon: AlertTriangle },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="sl-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{c.label}</span>
              <c.icon size={18} className="text-sl-red" />
            </div>
            <p className="mt-2 text-2xl font-black text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 sl-card rounded-xl p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Últimos Pedidos</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-white/50">Nenhum pedido registrado ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/50">
                <th className="pb-2">Cliente</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 text-white/80">
                  <td className="py-2">{o.customerName}</td>
                  <td className="py-2">{STATUS_LABEL[o.status] ?? o.status}</td>
                  <td className="py-2 text-right">{formatCurrency(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
