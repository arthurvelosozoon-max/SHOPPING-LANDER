import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";

export default async function AdminCustomersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      customerName: true,
      customerPhone: true,
      customerCpf: true,
      total: true,
      createdAt: true,
    },
  });

  const customersByPhone = new Map<
    string,
    { name: string; phone: string; cpf: string | null; totalSpent: number; orderCount: number; lastOrderAt: Date }
  >();

  for (const o of orders) {
    const existing = customersByPhone.get(o.customerPhone);
    if (existing) {
      existing.totalSpent += o.total;
      existing.orderCount += 1;
      if (o.createdAt > existing.lastOrderAt) existing.lastOrderAt = o.createdAt;
    } else {
      customersByPhone.set(o.customerPhone, {
        name: o.customerName,
        phone: o.customerPhone,
        cpf: o.customerCpf,
        totalSpent: o.total,
        orderCount: 1,
        lastOrderAt: o.createdAt,
      });
    }
  }

  const customers = Array.from(customersByPhone.values()).sort(
    (a, b) => b.lastOrderAt.getTime() - a.lastOrderAt.getTime()
  );

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Clientes</h1>
      <p className="mb-6 text-sm text-white/50">
        Lista gerada automaticamente a partir dos pedidos registrados (não há cadastro de conta
        de cliente).
      </p>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Nome</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">CPF</th>
              <th className="p-4">Pedidos</th>
              <th className="p-4">Total Gasto</th>
              <th className="p-4">Última Compra</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/40">
                  Nenhum cliente ainda — cadastre um pedido para começar.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.phone} className="border-b border-white/5 text-white/80">
                <td className="p-4">{c.name}</td>
                <td className="p-4 text-white/50">{c.phone}</td>
                <td className="p-4 text-white/50">{c.cpf ?? "—"}</td>
                <td className="p-4">{c.orderCount}</td>
                <td className="p-4 font-bold text-sl-red">{formatCurrency(c.totalSpent)}</td>
                <td className="p-4 text-white/50">
                  {c.lastOrderAt.toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
