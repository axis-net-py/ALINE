import Stripe from "stripe";

// Chave restrita (rk_) é preferível à secret key (sk_) — ver README.
// null quando não configurado; chamadores degradam (WhatsApp fallback).
export function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

// Rótulo fixo para agrupar sessões deste fluxo no Dashboard do Stripe.
// Suffix de 8 letras gerado uma vez — não regenerar a cada request.
export const INTEGRATION_IDENTIFIER = "aline-web-checkout-qmzklyer";
