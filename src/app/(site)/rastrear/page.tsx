"use client";

import { useState, useTransition } from "react";
import { Search, Package, ExternalLink, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { trackOrder, type TrackedOrder } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Recebido",
  PAID: "Pago",
  PACKING: "Separando",
  SHIPPED: "Enviado",
  COMPLETED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolso",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400",
  PAID: "bg-blue-500/15 text-blue-400",
  PACKING: "bg-purple-500/15 text-purple-400",
  SHIPPED: "bg-cyan-500/15 text-cyan-400",
  COMPLETED: "bg-green-500/15 text-green-400",
  CANCELLED: "bg-white/10 text-white/40",
  REFUNDED: "bg-sl-red/15 text-sl-red",
};

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TrackedOrder[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const orders = await trackOrder(query);
      setResults(orders);
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <span className="inline-block rounded-full border border-sl-red/50 bg-sl-red/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-sl-red">
        Rastrear Pedido
      </span>
      <h1 className="mt-4 text-3xl font-black text-white">Acompanhe seu pedido</h1>
      <p className="mt-3 text-white/60">
        Informe o número do pedido (ex: PED-0001) ou o seu CPF para consultar o status.
      </p>

      <form onSubmit={handleSearch} className="mt-8 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Número do pedido ou CPF"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sl-red"
        />
        <button
          type="submit"
          disabled={isPending || !query.trim()}
          className="flex items-center gap-2 rounded-lg bg-sl-red px-6 py-3 font-bold text-white transition hover:bg-sl-red-glow disabled:opacity-50"
        >
          <Search size={18} />
          {isPending ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {results !== null && (
        <div className="mt-10 space-y-6">
          {results.length === 0 ? (
            <p className="text-center text-white/50">
              Nenhum pedido encontrado com essas informações.
            </p>
          ) : (
            results.map((order) => (
              <div key={order.id} className="sl-card rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-white">#{order.orderNumber}</h2>
                    <p className="text-xs text-white/40">
                      {order.createdAt.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[order.status] ?? "bg-white/10 text-white/40"}`}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-white/80">
                        <Package size={14} className="text-white/40" />
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="text-white/60">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-end border-t border-white/10 pt-2 text-sm font-bold text-white">
                    Total: <span className="ml-2 text-sl-red">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {(order.carrier || order.trackingCode) && (
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                      <Truck size={16} className="text-sl-red" /> Informações de Envio
                    </h3>
                    {order.carrier && (
                      <p className="text-sm text-white/70">Transportadora: {order.carrier}</p>
                    )}
                    {order.trackingCode && (
                      <p className="text-sm text-white/70">
                        Código de rastreio:{" "}
                        <span className="font-mono">{order.trackingCode}</span>
                      </p>
                    )}
                    {order.shippedAt && (
                      <p className="text-sm text-white/70">
                        Enviado em: {order.shippedAt.toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {order.estimatedDelivery && (
                      <p className="text-sm text-white/70">
                        Previsão de entrega:{" "}
                        {order.estimatedDelivery.toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {order.shippingNotes && (
                      <p className="text-sm text-white/50">{order.shippingNotes}</p>
                    )}
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sl-red px-4 py-2 text-sm font-bold text-white transition hover:bg-sl-red-glow"
                      >
                        Rastrear na Transportadora <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
