import type { CartItem } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/format";

export const WHATSAPP_NUMBER = "5534997379159";

export type PaymentMethod = "PIX" | "DEBITO" | "CREDITO";

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  PIX: "PIX",
  DEBITO: "Cartão de Débito",
  CREDITO: "Cartão de Crédito",
};

type OrderInput = {
  items: CartItem[];
  customerName: string;
  paymentMethod: PaymentMethod;
  notes: string;
  total: number;
};

export function generateWhatsappMessage({
  items,
  customerName,
  paymentMethod,
  notes,
  total,
}: OrderInput) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const productLines = items
    .map((item, index) => {
      const subtotal = item.price * item.quantity;
      return [
        `${index + 1}️⃣ ${item.name}`,
        ``,
        `Quantidade: ${item.quantity}`,
        `Preço: ${formatCurrency(item.price)}`,
        `Subtotal: ${formatCurrency(subtotal)}`,
      ].join("\n");
    })
    .join("\n\n━━━━━━━━━━━━━━\n\n");

  const lines = [
    "🛒 *NOVO PEDIDO*",
    "",
    "Olá!",
    "",
    "Gostaria de realizar o seguinte pedido:",
    "",
    "━━━━━━━━━━━━━━",
    "",
    "📦 PRODUTOS",
    "",
    productLines,
    "",
    "━━━━━━━━━━━━━━",
    "",
    "📊 RESUMO",
    "",
    "Total de itens:",
    `${totalItems}`,
    "",
    "Valor Total:",
    formatCurrency(total),
    "",
    "━━━━━━━━━━━━━━",
    "",
    "💳 Forma de pagamento",
    "",
    PAYMENT_METHOD_LABEL[paymentMethod],
    "",
    "━━━━━━━━━━━━━━",
    "",
    "👤 Cliente",
    "",
    customerName,
    "",
    "━━━━━━━━━━━━━━",
    "",
    "📝 Observações",
    "",
    notes.trim() || "Nenhuma",
    "",
    "━━━━━━━━━━━━━━",
    "",
    "Obrigado!",
  ];

  return lines.join("\n");
}

export function buildWhatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function sendToWhatsapp(order: OrderInput) {
  const message = generateWhatsappMessage(order);
  const url = buildWhatsappUrl(message);
  window.open(url, "_blank");
}

export function generateQuoteMessage(productName: string) {
  return [
    "💬 *SOLICITAÇÃO DE ORÇAMENTO*",
    "",
    "Olá! Gostaria de solicitar um orçamento para o produto:",
    "",
    `📦 ${productName}`,
    "",
    "Aguardo o retorno, obrigado!",
  ].join("\n");
}

export function requestQuoteOnWhatsapp(productName: string) {
  const message = generateQuoteMessage(productName);
  const url = buildWhatsappUrl(message);
  window.open(url, "_blank");
}
