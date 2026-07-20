import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-sl-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-white/50">
            Alta performance em cada compra. Suplementos, moda fitness, acessórios e eletrônicos
            com curadoria premium.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Institucional</h3>
          <ul className="space-y-2 text-sm text-white/50">
            <li><Link href="/sobre" className="hover:text-sl-red">Sobre nós</Link></li>
            <li><Link href="/trocas" className="hover:text-sl-red">Trocas e devoluções</Link></li>
            <li><Link href="/privacidade" className="hover:text-sl-red">Política de privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Atendimento</h3>
          <ul className="space-y-2 text-sm text-white/50">
            <li><Link href="/contato" className="hover:text-sl-red">Fale conosco</Link></li>
            <li><Link href="/pedidos" className="hover:text-sl-red">Meus pedidos</Link></li>
            <li><Link href="/faq" className="hover:text-sl-red">Perguntas frequentes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Newsletter</h3>
          <p className="mb-3 text-sm text-white/50">Receba ofertas exclusivas em primeira mão.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sl-red"
            />
            <button className="rounded-md bg-sl-red px-4 py-2 text-sm font-bold text-white hover:bg-sl-red-glow">
              OK
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Shopping Lander. Todos os direitos reservados.
      </div>
    </footer>
  );
}
