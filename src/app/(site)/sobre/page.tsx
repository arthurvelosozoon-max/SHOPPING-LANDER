import { ShieldCheck, Truck, Zap, Award } from "lucide-react";

const VALUES = [
  {
    icon: Zap,
    title: "Alta Performance",
    description:
      "Curadoria de produtos pensada para quem treina sério: suplementos, moda fitness, acessórios e eletrônicos esportivos selecionados a dedo.",
  },
  {
    icon: ShieldCheck,
    title: "Produtos Originais",
    description:
      "Trabalhamos apenas com marcas e fornecedores confiáveis, garantindo procedência e qualidade em cada item vendido.",
  },
  {
    icon: Truck,
    title: "Entrega em Todo o Brasil e Paraguai",
    description:
      "Enviamos para todo o território nacional e também para o Paraguai, com prazos combinados diretamente pelo WhatsApp.",
  },
  {
    icon: Award,
    title: "Atendimento Direto",
    description:
      "Sem burocracia: fale com a gente pelo WhatsApp, tire dúvidas, monte seu pedido e receba um atendimento próximo do início ao fim.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <span className="inline-block rounded-full border border-sl-red/50 bg-sl-red/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-sl-red">
        Sobre Nós
      </span>
      <h1 className="mt-4 text-4xl font-black text-white">
        A força por trás do <span className="text-sl-red sl-glow-text">Shopping Lander</span>
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-white/70">
        O Shopping Lander nasceu para atender quem busca alta performance dentro e fora da
        academia. Reunimos suplementos, moda fitness, acessórios e eletrônicos esportivos em um
        só lugar, com curadoria premium e atendimento direto, sem enrolação.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-white/70">
        Nossa missão é simples: entregar produtos de qualidade, com preço justo e uma experiência
        de compra rápida — do clique no carrinho até a confirmação do pedido pelo WhatsApp.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {VALUES.map((v) => (
          <div key={v.title} className="sl-card rounded-xl p-6">
            <v.icon className="text-sl-red" size={28} />
            <h2 className="mt-4 text-lg font-bold text-white">{v.title}</h2>
            <p className="mt-2 text-sm text-white/60">{v.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
