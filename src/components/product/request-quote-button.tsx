"use client";

import { MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { requestQuoteOnWhatsapp } from "@/lib/whatsapp";

export function RequestQuoteButton({ productName }: { productName: string }) {
  const { showToast } = useToast();

  return (
    <button
      onClick={() => {
        showToast("Redirecionando para o WhatsApp...");
        requestQuoteOnWhatsapp(productName);
      }}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 py-3 font-bold text-green-400 transition hover:bg-green-500/20"
    >
      <MessageCircle size={18} />
      Solicitar Orçamento no WhatsApp
    </button>
  );
}
