import { NextResponse } from "next/server";
import { updateOrderPayment } from "@/lib/orders";

// Webhook do Mercado Pago: consulta o pagamento e atualiza o pedido
// no banco via external_reference (id do pedido).
export async function POST(req: Request) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ ok: true }); // nada a fazer

  let body: { type?: string; data?: { id?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (body.type === "payment" && body.data?.id) {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const payment = await res.json();
      console.log("[mp-webhook] pagamento", {
        id: payment.id,
        status: payment.status,
        ref: payment.external_reference,
      });
      if (payment.external_reference) {
        const map: Record<string, "pago" | "cancelado"> = {
          approved: "pago",
          cancelled: "cancelado",
          rejected: "cancelado",
          refunded: "cancelado",
        };
        const status = map[payment.status as string];
        await updateOrderPayment(payment.external_reference, {
          mp_payment_id: String(payment.id),
          customer_email: payment.payer?.email ?? null,
          ...(status ? { status } : {}),
        });
      }
    }
  }
  // 200 sempre: MP reenvia em caso de erro, e não queremos loop de retry
  return NextResponse.json({ ok: true });
}
