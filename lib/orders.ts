import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type OrderStatus = "pendente" | "pago" | "separando" | "enviado" | "entregue" | "cancelado";
export const STATUSES: OrderStatus[] = ["pendente", "pago", "separando", "enviado", "entregue", "cancelado"];

export type Order = {
  id: string;
  token: string;
  status: OrderStatus;
  total: number;
  customer_name: string | null;
  customer_email: string | null;
  mp_payment_id: string | null;
  tracking_code: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};
export type OrderItem = { product_id: string; name: string; qty: number; unit_price: number };

// null quando Supabase não está configurado — chamadores degradam.
export function db(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function createOrder(
  items: OrderItem[],
  total: number
): Promise<{ id: string; token: string } | null> {
  const client = db();
  if (!client) return null;
  const { data: order, error } = await client
    .from("orders")
    .insert({ total })
    .select("id, token")
    .single();
  if (error || !order) {
    console.error("[orders] insert falhou:", error?.message);
    return null;
  }
  const { error: itemsError } = await client
    .from("order_items")
    .insert(items.map((i) => ({ ...i, order_id: order.id })));
  if (itemsError) console.error("[orders] itens falharam:", itemsError.message);
  return order;
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  const client = db();
  if (!client) return null;
  const { data } = await client
    .from("orders")
    .select("*, order_items(product_id, name, qty, unit_price)")
    .eq("token", token)
    .single();
  return (data as Order) ?? null;
}

export async function listOrders(): Promise<Order[]> {
  const client = db();
  if (!client) return [];
  const { data } = await client
    .from("orders")
    .select("*, order_items(product_id, name, qty, unit_price)")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data as Order[]) ?? [];
}

export async function updateOrder(
  id: string,
  fields: Partial<Pick<Order, "status" | "tracking_code" | "mp_payment_id" | "customer_email" | "customer_name">>
) {
  const client = db();
  if (!client) return;
  const { error } = await client
    .from("orders")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("[orders] update falhou:", error.message);
}
