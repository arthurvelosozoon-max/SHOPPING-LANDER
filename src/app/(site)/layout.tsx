import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FavoritesProvider } from "@/components/favorites/favorites-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { getCategories } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <ToastProvider>
      <FavoritesProvider>
        <CartProvider>
          <Header categories={categories} />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </FavoritesProvider>
    </ToastProvider>
  );
}
