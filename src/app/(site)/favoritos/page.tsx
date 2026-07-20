"use client";

import Link from "next/link";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { ProductCard } from "@/components/product/product-card";

export default function FavoritesPage() {
  const { items } = useFavorites();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-black text-white">Nenhum favorito ainda</h1>
        <p className="mt-2 text-white/50">
          Toque no coração dos produtos para guardá-los aqui.
        </p>
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
      <h1 className="mb-8 text-3xl font-black text-white">Meus Favoritos</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ProductCard
            key={item.productId}
            product={{
              id: item.productId,
              slug: item.slug,
              name: item.name,
              price: item.price,
              salePrice: item.salePrice,
              image: item.image,
            }}
          />
        ))}
      </div>
    </div>
  );
}
