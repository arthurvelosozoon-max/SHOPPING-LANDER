"use client";

import { BadgeDollarSign, CreditCard, Wallet } from "lucide-react";
import type { PaymentMethod } from "@/lib/whatsapp";

const OPTIONS: { value: PaymentMethod; label: string; icon: typeof Wallet }[] = [
  { value: "PIX", label: "PIX", icon: BadgeDollarSign },
  { value: "DEBITO", label: "Cartão de Débito", icon: Wallet },
  { value: "CREDITO", label: "Cartão de Crédito", icon: CreditCard },
];

type Props = {
  value: PaymentMethod | null;
  onChange: (value: PaymentMethod) => void;
};

export function PaymentSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-bold transition ${
              selected
                ? "border-sl-red bg-sl-red/10 text-sl-red sl-red-glow"
                : "border-white/15 text-white/70 hover:border-white/30"
            }`}
          >
            <option.icon size={22} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
