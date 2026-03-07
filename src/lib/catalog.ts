/**
 * Catalog API client for fetching products and prices.
 *
 * Uses PUBLIC_CATALOG_API_URL env var (Astro exposes PUBLIC_ prefixed vars).
 * Falls back to production URL if not set.
 */

const API_BASE =
  (import.meta as any).env?.PUBLIC_CATALOG_API_URL ??
  'https://catalog.institutoitinerante.com.br/api';

// ── Types ──────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  metadata?: Record<string, any>;
}

export interface Price {
  id: string;
  product_id: string;
  amount_cents: number;
  currency: string;
  interval: 'once' | 'monthly' | 'yearly';
  trial_days: number;
}

export interface ProductWithPrices extends Product {
  prices: Price[];
}

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Format amount in cents to BRL display string.
 * 1900 → "R$ 19"  |  1990 → "R$ 19,90"
 */
export function formatPrice(amountCents: number): string {
  const reais = Math.floor(amountCents / 100);
  const centavos = amountCents % 100;
  if (centavos === 0) return `R$ ${reais}`;
  return `R$ ${reais},${centavos.toString().padStart(2, '0')}`;
}

// ── API calls ──────────────────────────────────────────────────────────

export async function fetchProducts(type?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams({ status: 'active' });
    if (type) params.set('type', type);

    const res = await fetch(`${API_BASE}/products?${params}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.products ?? [];
  } catch (err) {
    console.error('[catalog] fetchProducts failed:', err);
    return [];
  }
}

export async function fetchPrices(productId: string): Promise<Price[]> {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/prices`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.prices ?? [];
  } catch (err) {
    console.error(`[catalog] fetchPrices(${productId}) failed:`, err);
    return [];
  }
}

export async function fetchProductsWithPrices(
  type?: string,
): Promise<ProductWithPrices[]> {
  const products = await fetchProducts(type);
  if (products.length === 0) return [];

  const results = await Promise.all(
    products.map(async (product) => {
      const prices = await fetchPrices(product.id);
      return { ...product, prices };
    }),
  );

  return results;
}
