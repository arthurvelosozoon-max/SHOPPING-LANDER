"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

type Props = {
  product: { id: string; slug: string; name: string; price: number; image: string };
  disabled?: boolean;
};

export function AddToCartButton({ product, disabled }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-lg border border-white/15">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-3 text-white/70 hover:text-sl-red"
          disabled={disabled}
        >
          <Minus size={16} />
        </button>
        <span className="w-10 text-center text-white">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="p-3 text-white/70 hover:text-sl-red"
          disabled={disabled}
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={() =>
          addItem(
            { productId: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image },
            quantity
          )
        }
        disabled={disabled}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sl-red py-3 font-bold text-white transition hover:bg-sl-red-glow sl-red-glow disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShoppingCart size={18} />
        {disabled ? "Indisponível" : "Adicionar ao Carrinho"}
      </button>
    </div>
  );
}
