"use client";

import { useTransition } from "react";
import { toggleCoupon } from "@/app/admin/(dashboard)/cupons/actions";

export function ToggleCouponButton({ id, active }: { id: string; active: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleCoupon(id, !active))}
      disabled={isPending}
      className={`rounded-full px-2 py-1 text-xs font-bold transition disabled:opacity-50 ${
        active ? "bg-green-500/15 text-green-400 hover:bg-green-500/25" : "bg-white/10 text-white/40 hover:bg-white/20"
      }`}
    >
      {active ? "Ativo" : "Inativo"}
    </button>
  );
}
