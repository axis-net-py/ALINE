-- Endereço de entrega e telefone, coletados pelo próprio Stripe Checkout
-- (shipping_address_collection + phone_number_collection) e gravados
-- no pedido pelo webhook quando o pagamento é confirmado.
-- Já aplicado no projeto Neon "aline" (mute-mud-62821640).

alter table orders add column if not exists customer_phone text;
alter table orders add column if not exists address_name text;
alter table orders add column if not exists address_line1 text;
alter table orders add column if not exists address_line2 text;
alter table orders add column if not exists address_city text;
alter table orders add column if not exists address_state text;
alter table orders add column if not exists address_postal_code text;
