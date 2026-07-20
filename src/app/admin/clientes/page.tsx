import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Clientes</h1>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Pedidos</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-white/40">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-white/5 text-white/80">
                <td className="p-4">{c.name}</td>
                <td className="p-4 text-white/50">{c.email}</td>
                <td className="p-4">{c._count.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
