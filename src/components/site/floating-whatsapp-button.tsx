"use client";

import { MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { requestQuoteOnWhatsapp } from "@/lib/whatsapp";

export function FloatingWhatsappButton() {
  const { showToast } = useToast();

  return (
    <button
      onClick={() => {
        showToast("Redirecionando para o WhatsApp...");
        requestQuoteOnWhatsapp("Produtos do site (dúvida geral)");
      }}
      aria-label="Solicitar orçamento no WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 font-bold text-white shadow-xl transition hover:bg-green-600 hover:pr-5"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline">Orçamento no WhatsApp</span>
    </button>
  );
}
