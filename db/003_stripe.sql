-- Substitui Mercado Pago por Stripe: coluna genérica de payment id.
-- Já aplicado no projeto Neon "aline" (mute-mud-62821640).

alter table orders rename column mp_payment_id to payment_id;
