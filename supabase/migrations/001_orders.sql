-- Pedidos da loja ALINE.
-- Aplicar no SQL Editor do Supabase ou via `supabase db push`.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default replace(gen_random_uuid()::text, '-', ''),
  status text not null default 'pendente'
    check (status in ('pendente','pago','separando','enviado','entregue','cancelado')),
  total numeric(10,2) not null,
  customer_name text,
  customer_email text,
  mp_payment_id text,
  tracking_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  qty int not null check (qty > 0),
  unit_price numeric(10,2) not null
);

create index if not exists order_items_order_id on order_items(order_id);
create index if not exists orders_created_at on orders(created_at desc);

-- RLS ligado sem policies: acesso apenas pela service role (API do site).
alter table orders enable row level security;
alter table order_items enable row level security;
