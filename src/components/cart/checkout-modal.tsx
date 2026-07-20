"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, User, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { PaymentSelector } from "./payment-selector";
import { useToast } from "@/components/ui/toast";
import { sendToWhatsapp, type PaymentMethod } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/format";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CheckoutModal({ open, onClose }: Props) {
  const { items, subtotal } = useCart();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [notes, setNotes] = useState("");

  const canSubmit = name.trim().length > 0 && paymentMethod !== null && items.length > 0;

  const handleSubmit = () => {
    if (!canSubmit || !paymentMethod) return;

    showToast("Redirecionando para o WhatsApp...");
    sendToWhatsapp({
      items,
      customerName: name.trim(),
      paymentMethod,
      notes,
      total: subtotal,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[60] sm:inset-0 sm:flex sm:items-center sm:justify-center"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-sl-black p-6 sm:max-w-lg sm:rounded-2xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Finalizar Pedido</h2>
                <button onClick={onClose} className="text-white/60 hover:text-sl-red">
                  <X size={22} />
                </button>
              </div>

              <div className="mb-6 space-y-1 rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between text-sm text-white/70">
                  <span>{items.reduce((s, i) => s + i.quantity, 0)} item(ns)</span>
                  <span className="font-bold text-sl-red">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                    <User size={16} className="text-sl-red" /> Nome *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sl-red"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-white">
                    Forma de pagamento *
                  </label>
                  <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                    <MessageSquare size={16} className="text-sl-red" /> Observações
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: entregar após 18h, chamar no portão..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sl-red"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-sl-red py-3 font-bold text-white transition hover:bg-sl-red-glow sl-red-glow disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Enviar Pedido pelo WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
