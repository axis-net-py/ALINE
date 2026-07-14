import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { createOrder } from "@/lib/orders";

// Cria uma preference no Mercado Pago (Checkout Pro) e devolve a URL
// de pagamento. Preços SEMPRE do catálogo do servidor — nunca do cliente.
export async function POST(req: Request) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "mp_not_configured" }, { status: 503 });
  }

  let body: { items?: { id: string; qty: number }[] };
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
  const mpItems = [];
  for (const { id, qty } of items) {
    const p = catalog.find((c) => c.id === String(id));
    const q = Number(qty);
    if (!p || !Number.isInteger(q) || q < 1 || q > 99) {
      return NextResponse.json({ error: "invalid_item", id }, { status: 400 });
    }
    mpItems.push({
      id: p.id,
      title: p.name,
      quantity: q,
      currency_id: "BRL",
      unit_price: p.price,
    });
  }

  // pedido criado antes do pagamento; webhook promove pendente → pago
  const total = mpItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const order = await createOrder(
    mpItems.map((i) => ({ product_id: i.id, name: i.title, qty: i.quantity, unit_price: i.unit_price })),
    Math.round(total * 100) / 100
  );
  const tokenParam = order ? `&pedido=${order.token}` : "";

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3200";
  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      items: mpItems,
      external_reference: order?.id,
      back_urls: {
        success: `${site}/obrigado?status=success${tokenParam}`,
        pending: `${site}/obrigado?status=pending${tokenParam}`,
        failure: `${site}/obrigado?status=failure${tokenParam}`,
      },
      auto_return: "approved",
      notification_url: `${site}/api/mp-webhook`,
      statement_descriptor: "ALINE",
    }),
  });

  if (!res.ok) {
    console.error("MP preference error:", res.status, await res.text());
    return NextResponse.json({ error: "mp_error" }, { status: 502 });
  }
  const pref = await res.json();
  // sandbox_init_point para testes; init_point em produção
  const useSandbox = token.startsWith("TEST-");
  return NextResponse.json({ init_point: useSandbox ? pref.sandbox_init_point : pref.init_point });
}
