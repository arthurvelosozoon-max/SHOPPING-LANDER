"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ProductFormState } from "@/app/admin/(dashboard)/produtos/actions";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

type ProductFormValues = {
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  minStock: number;
  weight: number | null;
  categoryId: string;
  brandId: string | null;
  featured: boolean;
  active: boolean;
  images: string[];
};

type Props = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  brands: Brand[];
  initialValues?: ProductFormValues;
  submitLabel: string;
};

const initialState: ProductFormState = {};

export function ProductForm({ action, categories, brands, initialValues, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome *" htmlFor="name">
          <input
            id="name"
            name="name"
            required
            defaultValue={initialValues?.name}
            className="admin-input"
          />
        </Field>
        <Field label="SKU *" htmlFor="sku">
          <input
            id="sku"
            name="sku"
            required
            defaultValue={initialValues?.sku}
            className="admin-input"
          />
        </Field>
      </div>

      <Field label="Descrição *" htmlFor="description">
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={initialValues?.description}
          className="admin-input resize-none"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Preço *" htmlFor="price">
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={initialValues?.price}
            className="admin-input"
          />
        </Field>
        <Field label="Preço promocional" htmlFor="salePrice">
          <input
            id="salePrice"
            name="salePrice"
            type="number"
            step="0.01"
            defaultValue={initialValues?.salePrice ?? ""}
            className="admin-input"
          />
        </Field>
        <Field label="Estoque" htmlFor="stock">
          <input
            id="stock"
            name="stock"
            type="number"
            defaultValue={initialValues?.stock ?? 0}
            className="admin-input"
          />
        </Field>
        <Field label="Estoque mínimo" htmlFor="minStock">
          <input
            id="minStock"
            name="minStock"
            type="number"
            defaultValue={initialValues?.minStock ?? 5}
            className="admin-input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Categoria *" htmlFor="categoryId">
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialValues?.categoryId}
            className="admin-input"
          >
            <option value="">Selecione</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Marca" htmlFor="brandId">
          <select
            id="brandId"
            name="brandId"
            defaultValue={initialValues?.brandId ?? ""}
            className="admin-input"
          >
            <option value="">Nenhuma</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Peso (kg)" htmlFor="weight">
          <input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            defaultValue={initialValues?.weight ?? ""}
            className="admin-input"
          />
        </Field>
      </div>

      <Field label="Imagens (uma URL por linha)" htmlFor="images">
        <textarea
          id="images"
          name="images"
          rows={4}
          placeholder="https://exemplo.com/imagem1.jpg"
          defaultValue={initialValues?.images.join("\n")}
          className="admin-input resize-none font-mono text-xs"
        />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initialValues?.featured}
            className="h-4 w-4 accent-sl-red"
          />
          Produto em destaque
        </label>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            name="active"
            defaultChecked={initialValues?.active ?? true}
            className="h-4 w-4 accent-sl-red"
          />
          Ativo (visível na loja)
        </label>
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
          href="/admin/produtos"
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
