# ALINE — Loja de Maquiagem & Cosméticos

Next.js + Sanity (catálogo) + Mercado Pago Checkout Pro.

## Rodar local

```bash
npm install
cp .env.example .env.local   # preencha os valores
npm run dev                   # http://localhost:3200
```

Sem env configurado o site funciona em modo demonstração: catálogo local
e checkout com fallback para WhatsApp.

## Mercado Pago (sandbox)

1. Crie uma aplicação em https://www.mercadopago.com.br/developers/panel/app
2. Copie o **Access Token de teste** (começa com `TEST-`) para
   `MERCADOPAGO_ACCESS_TOKEN` no `.env.local`
3. Token `TEST-` usa o checkout sandbox automaticamente; em produção,
   troque pelo token de produção na Vercel

Fluxo: carrinho → `POST /api/checkout` (preços validados no servidor) →
redirect Checkout Pro → retorno em `/obrigado` → webhook `POST /api/mp-webhook`.

## Sanity (inventário)

1. `npm create sanity@latest` (projeto separado, ex. pasta `studio/`)
2. Copie `sanity/schemas/product.ts` para os schemas do studio e registre
3. Preencha `SANITY_PROJECT_ID` e `SANITY_DATASET` no `.env.local`
4. Cadastre produtos no Studio — o site passa a ler do Sanity
   (produtos com `stock > 0`, revalidação a cada 60s)

## Pedidos (Neon Postgres)

Banco já provisionado: projeto Neon **aline** (`mute-mud-62821640`),
schema em `db/001_orders.sql` aplicado. Basta:

1. Copiar a connection string do projeto (console.neon.tech) para `DATABASE_URL`
2. Definir `ADMIN_PASSWORD` para o painel

Fluxo do pedido: checkout cria pedido `pendente` → webhook do MP promove
para `pago` → admin atualiza `separando/enviado/entregue` + código de
rastreio → cliente acompanha em `/pedido/{token}` (link mostrado no
/obrigado — sem login).

- **Painel admin**: `/admin` (senha do env; cookie válido por 7 dias)
- **Cliente**: `/pedido/{token}` — timeline, itens, rastreio com link Correios

## Roadmap

- [x] Fase 1 — loja + checkout Mercado Pago sandbox
- [x] Fase 2 — pedidos no Neon Postgres, painel admin (status + código de rastreio), página de acompanhamento do cliente via link com token
- [ ] Fase 3 — Melhor Envio (cotação de frete, etiqueta, rastreio automático) + e-mail transacional
