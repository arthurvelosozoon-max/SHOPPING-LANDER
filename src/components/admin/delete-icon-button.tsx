"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteIconButton({
  itemName,
  action,
}: {
  itemName: string;
  action: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Excluir "${itemName}"?`)) return;
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Não foi possível excluir.");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-white/50 hover:text-sl-red disabled:opacity-40"
      aria-label="Excluir"
    >
      <Trash2 size={16} />
    </button>
  );
}
