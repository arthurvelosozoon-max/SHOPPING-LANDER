"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";
import { CheckoutModal } from "./checkout-modal";
import { formatCurrency } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-sl-black border-l border-white/10"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <h2 className="text-lg font-bold text-white">Seu Carrinho</h2>
                <button onClick={closeCart} className="text-white/60 hover:text-sl-red">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 && (
                  <p className="text-white/50 text-sm">Seu carrinho está vazio.</p>
                )}
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 sl-card rounded-lg p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white/5">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="text-sl-red font-bold text-sm">{formatCurrency(item.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="rounded border border-white/15 p-1 text-white/70 hover:border-sl-red hover:text-sl-red"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="rounded border border-white/15 p-1 text-white/70 hover:border-sl-red hover:text-sl-red"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-auto text-white/40 hover:text-sl-red"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 p-5 space-y-3">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <button
                  onClick={() => setCheckoutOpen(true)}
                  disabled={items.length === 0}
                  className="block w-full rounded-lg bg-sl-red py-3 text-center font-bold text-white transition hover:bg-sl-red-glow sl-red-glow disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Finalizar Compra
                </button>
                <Link
                  href="/carrinho"
                  onClick={closeCart}
                  className="block w-full rounded-lg border border-white/15 py-3 text-center text-sm font-bold text-white/80 transition hover:border-sl-red hover:text-sl-red"
                >
                  Ver Carrinho Completo
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
