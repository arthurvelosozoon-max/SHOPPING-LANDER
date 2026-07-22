export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function discountPercent(price: number, salePrice?: number | null) {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/** A promotional price of 0 or less means "no promotion", not "free". */
export function effectivePrice(price: number, salePrice?: number | null) {
  return salePrice && salePrice > 0 ? salePrice : price;
}
