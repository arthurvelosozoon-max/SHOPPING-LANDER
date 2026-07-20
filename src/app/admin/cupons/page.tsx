import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Cupons</h1>
        <button className="flex items-center gap-2 rounded-lg bg-sl-red px-4 py-2 text-sm font-bold text-white hover:bg-sl-red-glow">
          <Plus size={16} /> Novo Cupom
        </button>
      </div>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Código</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Usos</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/40">
                  Nenhum cupom cadastrado ainda.
                </td>
              </tr>
            )}
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-white/5 text-white/80">
                <td className="p-4 font-mono font-bold text-white">{c.code}</td>
                <td className="p-4">{c.type === "PERCENT" ? "Percentual" : "Valor Fixo"}</td>
                <td className="p-4">
                  {c.type === "PERCENT" ? `${c.value}%` : `R$ ${c.value.toFixed(2)}`}
                </td>
                <td className="p-4">
                  {c.usedCount}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      c.active ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {c.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
