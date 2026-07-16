import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { createOrder } from "@/lib/orders";
import { calculateShipping } from "@/lib/shipping";
import { stripe, INTEGRATION_IDENTIFIER } from "@/lib/stripe";

const FREE_SHIP = 199;

// Cria uma Checkout Session no Stripe e devolve a URL de pagamento.
// Preços SEMPRE do catálogo do servidor — nunca do cliente.
export async function POST(req: Request) {
  const client = stripe();
  if (!client) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  let body: {
    items?: { id: string; qty: number }[];
    shipping?: { serviceId: string; cep: string } | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const items = body.items ?? [];
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return NextResponse.json({ error: "invalid_items" }, { status: 400 });
  }

  const catalog = await getProducts();
  type Line = { id: string; title: string; quantity: number; unit_price: number };
  const lines: Line[] = [];
  for (const { id, qty } of items) {
    const p = catalog.find((c) => c.id === String(id));
    const q = Number(qty);
    if (!p || !Number.isInteger(q) || q < 1 || q > 99) {
      return NextResponse.json({ error: "invalid_item", id }, { status: 400 });
    }
    lines.push({ id: p.id, title: p.name, quantity: q, unit_price: p.price });
  }

  const subtotal = lines.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  // frete recalculado no servidor a partir da cotação real — nunca
  // confiar no preço que o cliente mandou de volta
  let shippingPrice = 0;
  let shippingLabel: string | null = null;
  let shippingCep: string | null = null;
  if (body.shipping?.serviceId && body.shipping?.cep) {
    const quote = await calculateShipping(body.shipping.cep, items);
    if (!quote.ok) {
      return NextResponse.json({ error: "invalid_shipping" }, { status: 400 });
    }
    const option = quote.options.find((o) => o.id === body.shipping!.serviceId);
    if (!option) {
      return NextResponse.json({ error: "invalid_shipping" }, { status: 400 });
    }
    shippingPrice = subtotal >= FREE_SHIP ? 0 : option.price;
    shippingLabel = `${option.company} · ${option.name}`;
    shippingCep = body.shipping.cep.replace(/\D/g, "");
    if (shippingPrice > 0) {
      lines.push({ id: "frete", title: `Frete — ${shippingLabel}`, quantity: 1, unit_price: shippingPrice });
    }
  }

  const total = lines.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  // pedido criado antes do pagamento; webhook promove pendente → pago
  const order = await createOrder(
    lines
      .filter((i) => i.id !== "frete")
      .map((i) => ({ product_id: i.id, name: i.title, qty: i.quantity, unit_price: i.unit_price })),
    Math.round(total * 100) / 100,
    shippingLabel ? { price: shippingPrice, service: shippingLabel, cep: shippingCep! } : null
  );
  const tokenParam = order ? `&pedido=${order.token}` : "";

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3200";
  try {
    const session = await client.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((i) => ({
        quantity: i.quantity,
        price_data: {
          currency: "brl",
          unit_amount: Math.round(i.unit_price * 100),
          product_data: { name: i.title },
        },
      })),
      // payment_method_types omitido de propósito: métodos habilitados
      // no Dashboard (Settings → Payment methods) decidem o que aparece
      locale: "pt-BR",
      shipping_address_collection: { allowed_countries: ["BR"] },
      phone_number_collection: { enabled: true },
      metadata: order ? { order_id: order.id } : {},
      success_url: `${site}/obrigado?status=success${tokenParam}`,
      cancel_url: `${site}/obrigado?status=failure${tokenParam}`,
      integration_identifier: INTEGRATION_IDENTIFIER,
    });
    if (!session.url) return NextResponse.json({ error: "stripe_error" }, { status: 502 });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout session error:", e);
    return NextResponse.json({ error: "stripe_error" }, { status: 502 });
  }
}
