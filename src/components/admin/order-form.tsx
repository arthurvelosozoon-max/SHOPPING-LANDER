"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency, effectivePrice } from "@/lib/format";
import type { OrderFormState, OrderItemInput } from "@/app/admin/(dashboard)/pedidos/actions";

type ProductOption = { id: string; name: string; price: number; salePrice: number | null };

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Recebido" },
  { value: "PAID", label: "Pago" },
  { value: "PACKING", label: "Separando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "COMPLETED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolso" },
];

const PAYMENT_OPTIONS = ["PIX", "Cartão de Débito", "Cartão de Crédito"];

type Props = {
  action: (state: OrderFormState, formData: FormData) => Promise<OrderFormState>;
  products: ProductOption[];
  submitLabel: string;
  initialValues?: {
    customerName: string;
    customerPhone: string;
    customerCpf: string | null;
    paymentMethod: string;
    notes: string | null;
    status: string;
    carrier: string | null;
    trackingCode: string | null;
    trackingUrl: string | null;
    shippedAt: string | null;
    estimatedDelivery: string | null;
    shippingNotes: string | null;
    items: OrderItemInput[];
  };
};

const initialState: OrderFormState = {};

export function OrderForm({ action, products, submitLabel, initialValues }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [items, setItems] = useState<OrderItemInput[]>(initialValues?.items ?? []);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const addItem = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product || quantity < 1) return;
    const price = effectivePrice(product.price, product.salePrice);

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, price, quantity }];
    });
    setQuantity(1);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <input type="hidden" name="itemsJson" value={JSON.stringify(items)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Nome do cliente *" htmlFor="customerName">
          <input
            id="customerName"
            name="customerName"
            required
            defaultValue={initialValues?.customerName}
            className="admin-input"
          />
        </Field>
        <Field label="Telefone *" htmlFor="customerPhone">
          <input
            id="customerPhone"
            name="customerPhone"
            required
            defaultValue={initialValues?.customerPhone}
            className="admin-input"
          />
        </Field>
        <Field label="CPF" htmlFor="customerCpf">
          <input
            id="customerCpf"
            name="customerCpf"
            defaultValue={initialValues?.customerCpf ?? ""}
            className="admin-input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Forma de pagamento *" htmlFor="paymentMethod">
          <select
            id="paymentMethod"
            name="paymentMethod"
            required
            defaultValue={initialValues?.paymentMethod ?? PAYMENT_OPTIONS[0]}
            className="admin-input"
          >
            {PAYMENT_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status" htmlFor="status">
          <select
            id="status"
            name="status"
            defaultValue={initialValues?.status ?? "PENDING"}
            className="admin-input"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Observações" htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={initialValues?.notes ?? ""}
          className="admin-input resize-none"
        />
      </Field>

      <div className="sl-card rounded-xl p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/50">Produtos</h2>

        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="mb-1.5 block text-sm font-medium text-white/80">Produto</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="admin-input"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatCurrency(effectivePrice(p.price, p.salePrice))}
                </option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="mb-1.5 block text-sm font-medium text-white/80">Qtd.</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="admin-input"
            />
          </div>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 rounded-lg bg-sl-red px-4 py-2.5 text-sm font-bold text-white hover:bg-sl-red-glow"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-white/40">Nenhum produto adicionado ainda.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sl-red">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-white/40 hover:text-sl-red"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end border-t border-white/10 pt-3 text-base font-bold text-white">
              Total: <span className="ml-2 text-sl-red">{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="sl-card rounded-xl p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/50">
          Informações de Envio
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Transportadora" htmlFor="carrier">
            <input
              id="carrier"
              name="carrier"
              defaultValue={initialValues?.carrier ?? ""}
              className="admin-input"
            />
          </Field>
          <Field label="Código de Rastreio" htmlFor="trackingCode">
            <input
              id="trackingCode"
              name="trackingCode"
              defaultValue={initialValues?.trackingCode ?? ""}
              className="admin-input"
            />
          </Field>
          <Field label="Link Oficial da Transportadora" htmlFor="trackingUrl">
            <input
              id="trackingUrl"
              name="trackingUrl"
              type="url"
              defaultValue={initialValues?.trackingUrl ?? ""}
              className="admin-input"
            />
          </Field>
          <Field label="Data de Envio" htmlFor="shippedAt">
            <input
              id="shippedAt"
              name="shippedAt"
              type="date"
              defaultValue={initialValues?.shippedAt ?? ""}
              className="admin-input"
            />
          </Field>
          <Field label="Previsão de Entrega" htmlFor="estimatedDelivery">
            <input
              id="estimatedDelivery"
              name="estimatedDelivery"
              type="date"
              defaultValue={initialValues?.estimatedDelivery ?? ""}
              className="admin-input"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Observações do envio" htmlFor="shippingNotes">
            <textarea
              id="shippingNotes"
              name="shippingNotes"
              rows={2}
              defaultValue={initialValues?.shippingNotes ?? ""}
              className="admin-input resize-none"
            />
          </Field>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-sl-red/10 px-3 py-2 text-sm text-sl-red">{state.error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-sl-red px-6 py-3 font-bold text-white transition hover:bg-sl-red-glow disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link
          href="/admin/pedidos"
          className="rounded-lg border border-white/15 px-6 py-3 font-bold text-white/70 transition hover:border-white/30"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
      </label>
      {children}
    </div>
  );
}
