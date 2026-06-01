export function getCurrentPrice(product: {
  price: number;
  promo_price?: number | null;
  promo_start?: string | null;
  promo_end?: string | null;
}): { current: number; original: number; isPromo: boolean } {
  const now = new Date();
  if (product.promo_price && product.promo_start && product.promo_end) {
    if (now >= new Date(product.promo_start) && now <= new Date(product.promo_end)) {
      return { current: product.promo_price, original: product.price, isPromo: true };
    }
  }
  return { current: product.price, original: product.price, isPromo: false };
}
