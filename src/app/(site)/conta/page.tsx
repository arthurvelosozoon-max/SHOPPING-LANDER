import Link from "next/link";
import { User } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-sl-red/40 bg-sl-red/10">
        <User size={28} className="text-sl-red" />
      </div>
      <h1 className="text-2xl font-black text-white">Minha Conta</h1>
      <p className="mt-3 text-white/60">
        Login e cadastro de clientes ainda não estão disponíveis. Para acompanhar um pedido ou
        tirar dúvidas, fale com a gente diretamente pelo WhatsApp.
      </p>
      <Link
        href="/produtos"
        className="mt-8 inline-block rounded-lg bg-sl-red px-6 py-3 font-bold text-white transition hover:bg-sl-red-glow"
      >
        Ver Produtos
      </Link>
    </div>
  );
}
