"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { adjustStock } from "@/app/admin/(dashboard)/estoque/actions";

export function StockAdjustForm({ productId, stock }: { productId: string; stock: number }) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-white/40 hover:text-sl-red"
        aria-label="Ajustar estoque"
      >
        <Pencil size={14} />
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await adjustStock(formData);
        setEditing(false);
      }}
      className="flex items-center gap-1.5"
    >
      <input type="hidden" name="productId" value={productId} />
      <input
        type="number"
        name="newStock"
        min={0}
        defaultValue={stock}
        autoFocus
        className="w-20 rounded border border-white/15 bg-white/5 px-2 py-1 text-xs text-white"
      />
      <button type="submit" className="text-green-400 hover:text-green-300" aria-label="Confirmar">
        <Check size={16} />
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-white/40 hover:text-sl-red"
        aria-label="Cancelar"
      >
        <X size={16} />
      </button>
    </form>
  );
}
