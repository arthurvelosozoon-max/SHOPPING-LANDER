"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Upload, Link as LinkIcon, X, Loader2, Plus } from "lucide-react";
import { uploadProductImageAction } from "@/app/admin/(dashboard)/produtos/actions";

export function ProductImagesField({ initialImages = [] }: { initialImages?: string[] }) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [linkValue, setLinkValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLink = () => {
    const url = linkValue.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setLinkValue("");
    setError(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    startUpload(async () => {
      const result = await uploadProductImageAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setImages((prev) => [...prev, result.url as string]);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-white/80">Imagens do produto</label>
      <input type="hidden" name="images" value={images.join("\n")} />

      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-white/15 bg-white/5">
              <Image src={url} alt={`Imagem ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remover imagem"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 transition hover:border-sl-red hover:text-sl-red disabled:opacity-50"
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {isUploading ? "Enviando..." : "Anexar imagem"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2">
            <LinkIcon size={14} className="text-white/40" />
            <input
              type="text"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="Colar link da imagem"
              className="w-48 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={addLink}
            className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 transition hover:border-sl-red hover:text-sl-red"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-sl-red">{error}</p>}
    </div>
  );
}
