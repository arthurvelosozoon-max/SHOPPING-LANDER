"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const shipping = items.length > 0 ? 24.9 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-black text-white">Seu carrinho está vazio</h1>
        <p className="mt-2 text-white/50">Explore nossos produtos e monte seu pedido.</p>
        <Link
          href="/produtos"
          className="mt-6 inline-block rounded-lg bg-sl-red px-6 py-3 font-bold text-white hover:bg-sl-red-glow"
        >
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-white">Meu Carrinho</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="sl-card flex gap-4 rounded-xl p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white/5">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/produtos/${item.slug}`} className="font-medium text-white hover:text-sl-red">
                    {item.name}
                  </Link>
                  <button onClick={() => removeItem(item.productId)} className="text-white/40 hover:text-sl-red">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-white/15">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 text-white/70 hover:text-sl-red"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 text-white/70 hover:text-sl-red"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-sl-red">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-white/40 hover:text-sl-red">
            Limpar carrinho
          </button>
        </div>

        <div className="sl-card h-fit space-y-4 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white">Resumo do Pedido</h2>

          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Cupom de desconto"
              className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sl-red"
            />
            <button className="rounded-md border border-white/20 px-4 text-sm font-bold text-white hover:border-sl-red hover:text-sl-red">
              Aplicar
            </button>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-white/70">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Frete</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-white">
              <span>Total</span>
              <span className="text-sl-red">{formatCurrency(total)}</span>
            </div>
          </div>

          <button className="w-full rounded-lg bg-sl-red py-3 font-bold text-white transition hover:bg-sl-red-glow sl-red-glow">
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
