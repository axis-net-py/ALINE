import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { updateOrderPayment } from "@/lib/orders";

// Webhook do Stripe: checkout.session.completed cobre cartão (paga na
// hora); Pix e outros métodos assíncronos só confirmam via
// async_payment_succeeded/failed depois que o cliente já saiu da
// página. Assinatura sempre verificada — nunca processar sem isso.
export async function POST(req: Request) {
  const client = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!client || !secret) return NextResponse.json({ ok: true });

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  if (!signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(rawBody, signature, secret);
  } catch (e) {
    console.error("[stripe-webhook] assinatura inválida:", e);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id;

  if (orderId) {
    if (event.type === "checkout.session.completed" && session.payment_status === "paid") {
      await updateOrderPayment(orderId, {
        payment_id: String(session.payment_intent ?? session.id),
        customer_email: session.customer_details?.email ?? null,
        status: "pago",
      });
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      await updateOrderPayment(orderId, {
        payment_id: String(session.payment_intent ?? session.id),
        customer_email: session.customer_details?.email ?? null,
        status: "pago",
      });
    } else if (event.type === "checkout.session.async_payment_failed") {
      await updateOrderPayment(orderId, {
        payment_id: String(session.payment_intent ?? session.id),
        customer_email: session.customer_details?.email ?? null,
        status: "cancelado",
      });
    }
  }

  // 200 sempre: Stripe reenvia em caso de erro, e não queremos loop de retry
  return NextResponse.json({ ok: true });
}
