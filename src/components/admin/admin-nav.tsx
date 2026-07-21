"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Boxes,
  Ticket,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { logoutAction } from "@/app/admin/login/actions";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Categorias", href: "/admin/categorias", icon: Tags },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { label: "Estoque", href: "/admin/estoque", icon: Boxes },
  { label: "Cupons", href: "/admin/cupons", icon: Ticket },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-sl-red"
        >
          <item.icon size={18} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-sl-red"
      >
        <LogOut size={18} />
        Sair
      </button>
    </form>
  );
}

export function AdminNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-sl-black-soft p-6 lg:flex">
        <Logo />
        <div className="mt-10 flex flex-1 flex-col">
          <NavLinks />
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-sl-black-soft px-4 py-3 lg:hidden">
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          className="text-white/80 hover:text-sl-red"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-white/10 bg-sl-black-soft p-6 lg:hidden">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="text-white/80 hover:text-sl-red"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-1 flex-col">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
              <LogoutButton />
            </div>
          </div>
        </>
      )}
    </>
  );
}
