"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatCurrency, discountPercent } from "@/lib/format";
import { useCart } from "@/components/cart/cart-provider";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const discount = discountPercent(product.price, product.salePrice);
  const finalPrice = product.salePrice ?? product.price;

  return (
    <div className="group sl-card relative flex flex-col overflow-hidden rounded-xl transition hover:border-sl-red/50">
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-sl-red px-2 py-1 text-xs font-bold text-white">
          -{discount}%
        </span>
      )}
      <Link href={`/produtos/${product.slug}`} className="relative aspect-square overflow-hidden bg-white/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/produtos/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-white hover:text-sl-red">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between">
          <div>
            {discount > 0 && (
              <p className="text-xs text-white/40 line-through">{formatCurrency(product.price)}</p>
            )}
            <p className="text-lg font-black text-sl-red">{formatCurrency(finalPrice)}</p>
          </div>
          <button
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: finalPrice,
                image: product.image,
              })
            }
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-sl-red"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
