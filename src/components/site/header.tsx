"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorites } from "@/components/favorites/favorites-provider";

const NAV_LINKS = [
  { label: "Produtos", href: "/produtos" },
  { label: "Promoções", href: "/produtos?promo=1" },
  { label: "Lançamentos", href: "/produtos?novo=1" },
];

export function Header({ categories }: { categories: { name: string; slug: string }[] }) {
  const { totalItems, openCart } = useCart();
  const { totalItems: totalFavorites } = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-sl-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <button
          className="lg:hidden text-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Logo />

        <nav className="hidden lg:flex items-center gap-6 ml-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition hover:text-sl-red"
            >
              {link.label}
            </Link>
          ))}
          <div className="group relative">
            <button className="text-sm font-medium text-white/80 transition hover:text-sl-red">
              Categorias
            </button>
            <div className="invisible absolute left-0 top-full z-50 w-56 rounded-lg border border-white/10 bg-sl-black-soft p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/produtos?categoria=${c.slug}`}
                  className="block rounded px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-sl-red"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="ml-auto hidden flex-1 max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 lg:flex">
          <Search size={16} className="text-white/50" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-4 lg:ml-4">
          <Link href="/favoritos" className="relative hidden sm:block text-white/80 hover:text-sl-red">
            <Heart size={22} />
            {totalFavorites > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sl-red text-[10px] font-bold text-white">
                {totalFavorites}
              </span>
            )}
          </Link>
          <Link href="/conta" className="hidden sm:block text-white/80 hover:text-sl-red">
            <User size={22} />
          </Link>
          <button onClick={openCart} className="relative text-white/80 hover:text-sl-red">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sl-red text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/10 bg-sl-black-soft px-4 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-white/80 hover:text-sl-red"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/produtos?categoria=${c.slug}`}
              className="block py-2 text-sm text-white/60 hover:text-sl-red"
              onClick={() => setMobileOpen(false)}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
