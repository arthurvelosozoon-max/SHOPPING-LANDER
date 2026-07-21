import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";
import { ToggleCouponButton } from "@/components/admin/toggle-coupon-button";
import { createCoupon, deleteCoupon } from "./actions";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Cupons</h1>

      <form action={createCoupon} className="sl-card mb-8 grid grid-cols-1 gap-4 rounded-xl p-5 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-white/80">Código</label>
          <input name="code" required placeholder="PROMO10" className="admin-input" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">Tipo</label>
          <select name="type" defaultValue="PERCENT" className="admin-input">
            <option value="PERCENT">Percentual</option>
            <option value="FIXED">Valor Fixo</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">Valor</label>
          <input name="value" type="number" step="0.01" required className="admin-input" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">Pedido mínimo</label>
          <input name="minOrder" type="number" step="0.01" className="admin-input" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">Limite de uso</label>
          <input name="usageLimit" type="number" className="admin-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-white/80">Expira em</label>
          <input name="expiresAt" type="date" className="admin-input" />
        </div>
        <div className="flex items-end sm:col-span-2">
          <button className="flex items-center gap-2 rounded-lg bg-sl-red px-4 py-2.5 text-sm font-bold text-white hover:bg-sl-red-glow">
            <Plus size={16} /> Criar Cupom
          </button>
        </div>
      </form>

      <div className="sl-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-white/50">
              <th className="p-4">Código</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Usos</th>
              <th className="p-4">Expira</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-white/40">
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
                <td className="p-4 text-white/50">
                  {c.expiresAt ? c.expiresAt.toLocaleDateString("pt-BR") : "—"}
                </td>
                <td className="p-4">
                  <ToggleCouponButton id={c.id} active={c.active} />
                </td>
                <td className="p-4 text-right">
                  <DeleteIconButton itemName={c.code} action={deleteCoupon.bind(null, c.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
