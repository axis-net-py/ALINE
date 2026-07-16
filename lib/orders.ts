import { neon } from "@neondatabase/serverless";

export type OrderStatus = "pendente" | "pago" | "separando" | "enviado" | "entregue" | "cancelado";
export const STATUSES: OrderStatus[] = ["pendente", "pago", "separando", "enviado", "entregue", "cancelado"];

export type Order = {
  id: string;
  token: string;
  status: OrderStatus;
  total: number;
  customer_name: string | null;
  customer_email: string | null;
  payment_id: string | null;
  tracking_code: string | null;
  shipping_price: number;
  shipping_service: string | null;
  shipping_cep: string | null;
  customer_phone: string | null;
  address_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_state: string | null;
  address_postal_code: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};
export type OrderItem = { product_id: string; name: string; qty: number; unit_price: number };

// null quando o banco não está configurado — chamadores degradam.
function db() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

const ITEMS_JSON = `coalesce((
  select json_agg(json_build_object(
    'product_id', i.product_id, 'name', i.name,
    'qty', i.qty, 'unit_price', i.unit_price))
  from order_items i where i.order_id = orders.id
), '[]')`;

export type ShippingChoice = { price: number; service: string; cep: string } | null;

export async function createOrder(
  items: OrderItem[],
  total: number,
  shipping: ShippingChoice = null
): Promise<{ id: string; token: string } | null> {
  const sql = db();
  if (!sql) return null;
  try {
    const rows = (await sql`
      with o as (
        insert into orders (total, shipping_price, shipping_service, shipping_cep)
        values (${total}, ${shipping?.price ?? 0}, ${shipping?.service ?? null}, ${shipping?.cep ?? null})
        returning id, token
      )
      , _ as (
        insert into order_items (order_id, product_id, name, qty, unit_price)
        select o.id, x.product_id, x.name, x.qty, x.unit_price
        from o, jsonb_to_recordset(${JSON.stringify(items)}::jsonb)
          as x(product_id text, name text, qty int, unit_price numeric)
      )
      select id, token from o
    `) as { id: string; token: string }[];
    return rows[0] ?? null;
  } catch (e) {
    console.error("[orders] createOrder falhou:", e);
    return null;
  }
}

function normalize(row: Record<string, unknown>): Order {
  return { ...row, total: Number(row.total), shipping_price: Number(row.shipping_price ?? 0) } as Order;
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  const sql = db();
  if (!sql) return null;
  const rows = await sql`
    select orders.*, ${sql.unsafe(ITEMS_JSON)} as order_items
    from orders where token = ${token}
  `;
  return rows[0] ? normalize(rows[0]) : null;
}

export async function listOrders(): Promise<Order[]> {
  const sql = db();
  if (!sql) return [];
  const rows = await sql`
    select orders.*, ${sql.unsafe(ITEMS_JSON)} as order_items
    from orders order by created_at desc limit 200
  `;
  return rows.map(normalize);
}

export type CollectedAddress = {
  name: string | null;
  phone: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
} | null;

// Webhook: dados de pagamento + endereço coletado pelo Stripe Checkout.
// Status só muda se informado; campos ausentes preservam o valor atual.
export async function updateOrderPayment(
  id: string,
  fields: {
    payment_id: string;
    customer_email: string | null;
    status?: OrderStatus;
    address?: CollectedAddress;
  }
) {
  const sql = db();
  if (!sql) return;
  const a = fields.address ?? null;
  try {
    await sql`
      update orders set
        payment_id = ${fields.payment_id},
        customer_email = coalesce(${fields.customer_email}, customer_email),
        status = coalesce(${fields.status ?? null}, status),
        customer_phone = coalesce(${a?.phone ?? null}, customer_phone),
        address_name = coalesce(${a?.name ?? null}, address_name),
        address_line1 = coalesce(${a?.line1 ?? null}, address_line1),
        address_line2 = coalesce(${a?.line2 ?? null}, address_line2),
        address_city = coalesce(${a?.city ?? null}, address_city),
        address_state = coalesce(${a?.state ?? null}, address_state),
        address_postal_code = coalesce(${a?.postal_code ?? null}, address_postal_code),
        updated_at = now()
      where id = ${id}::uuid
    `;
  } catch (e) {
    console.error("[orders] updateOrderPayment falhou:", e);
  }
}

// Admin: status + código de rastreio.
export async function updateOrderAdmin(id: string, status: OrderStatus, tracking: string | null) {
  const sql = db();
  if (!sql) return;
  await sql`
    update orders set status = ${status}, tracking_code = ${tracking}, updated_at = now()
    where id = ${id}::uuid
  `;
}
