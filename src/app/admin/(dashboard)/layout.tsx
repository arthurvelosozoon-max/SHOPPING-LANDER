import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Ticket,
  Users,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { logoutAction } from "../login/actions";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { label: "Estoque", href: "/admin/estoque", icon: Boxes },
  { label: "Cupons", href: "/admin/cupons", icon: Ticket },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-sl-black">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-sl-black-soft p-6 lg:flex">
        <Logo />
        <nav className="mt-10 flex-1 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-sl-red"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-sl-red"
          >
            <LogOut size={18} />
            Sair
          </button>
        </form>
      </aside>
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
