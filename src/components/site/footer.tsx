import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-sl-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-white/50">
            Alta performance em cada compra. Suplementos, moda fitness, acessórios e eletrônicos
            com curadoria premium.
          </p>
          <p className="mt-3 text-sm font-bold text-sl-red">
            Entregamos em todo o Brasil 🇧🇷 e Paraguai 🇵🇾
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Institucional</h3>
          <ul className="space-y-2 text-sm text-white/50">
            <li><Link href="/sobre" className="hover:text-sl-red">Sobre nós</Link></li>
            <li><Link href="/rastrear" className="hover:text-sl-red">Rastrear Pedido</Link></li>
            <li><Link href="/privacidade" className="hover:text-sl-red">Política de privacidade</Link></li>
            <li>
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 hover:text-sl-red"
              >
                <ShieldCheck size={14} />
                Login Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Shopping Lander. Todos os direitos reservados.
      </div>
    </footer>
  );
}
