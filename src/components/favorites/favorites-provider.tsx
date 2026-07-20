"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type FavoriteItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
};

type FavoritesContextValue = {
  items: FavoriteItem[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  removeFavorite: (productId: string) => void;
  totalItems: number;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "shopping-lander-favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
        setItems(JSON.parse(raw));
      } catch {
        /* ignore corrupted favorites */
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const isFavorite = (productId: string) => items.some((i) => i.productId === productId);

  const toggleFavorite = (item: FavoriteItem) => {
    setItems((prev) =>
      prev.some((i) => i.productId === item.productId)
        ? prev.filter((i) => i.productId !== item.productId)
        : [...prev, item]
    );
  };

  const removeFavorite = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const totalItems = useMemo(() => items.length, [items]);

  return (
    <FavoritesContext.Provider
      value={{ items, isFavorite, toggleFavorite, removeFavorite, totalItems }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
