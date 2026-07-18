# VENUSTAS BEAUTY — Loja de Maquiagem & Cosméticos

Next.js + Sanity (catálogo) + checkout com coleta de endereço própria.

## Rodar local

```bash
npm install
cp .env.example .env.local   # preencha os valores
npm run dev                   # http://localhost:3200
```

## Checkout: WhatsApp + Pix (fluxo real hoje)

A conta Stripe está pendente de verificação (documentos não
atualizados) — sem `STRIPE_SECRET_KEY` configurada, `POST /api/checkout`
sempre segue este caminho, que é o que está em produção:

1. Cliente informa CEP no carrinho → `POST /api/shipping` cota o frete
   e devolve endereço (rua/bairro/cidade/UF) via BrasilAPI para
   pré-preencher o formulário
2. Cliente completa nome, telefone, número e complemento
3. `POST /api/checkout` valida tudo, recalcula o frete no servidor,
   **grava o pedido no Neon com o endereço completo** (status
   `pendente`) e devolve um link de WhatsApp com o resumo do pedido
4. Cliente confirma o pagamento por Pix diretamente no WhatsApp; o
   lojista marca o pedido como `pago` manualmente no `/admin`

## Stripe (dormente — reativa sozinho quando a conta for aprovada)

Se `STRIPE_SECRET_KEY` estiver configurada, `POST /api/checkout` usa
Stripe Checkout Session em vez do link de WhatsApp — sem precisar
mudar código, é só preencher a env.

1. Developers → API keys. Prefira uma **Restricted key** (`rk_...`) —
   ver [best practices](https://docs.stripe.com/keys-best-practices.md).
   Cole em `STRIPE_SECRET_KEY`
2. **Métodos de pagamento**: Settings → Payment methods → habilite o
   que a conta suportar. O código nunca força `payment_method_types` —
   o que estiver habilitado no Dashboard aparece no Checkout,
   [dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods.md)
3. **Webhook**:
   - Local: `stripe listen --forward-to localhost:3200/api/stripe-webhook`
     imprime um `whsec_...` — cole em `STRIPE_WEBHOOK_SECRET`
   - Produção: Developers → Webhooks → Add endpoint →
     `https://seu-dominio/api/stripe-webhook` → eventos
     `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
     `checkout.session.async_payment_failed` → copie o signing secret

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

Fluxo do pedido: checkout cria pedido `pendente` com endereço →
lojista confirma o Pix e marca `pago` no admin (ou, com Stripe ativo,
o webhook faz isso sozinho) → admin atualiza
`separando/enviado/entregue` + código de rastreio → cliente acompanha
em `/pedido/{token}` (link enviado por WhatsApp — sem login).

- **Painel admin**: `/admin` (senha do env; cookie válido por 7 dias)
- **Cliente**: `/pedido/{token}` — timeline, itens, rastreio com link Correios

## Frete (tabela fixa por região)

Sem API paga nem cadastro externo. `lib/shipping.ts` resolve o estado do
CEP digitado via [BrasilAPI](https://brasilapi.com.br) (pública, sem
token — hospedada na Vercel) e aplica um preço fixo por região a partir
de Belém-PA (constantes `REGIONS`/`STATE_REGION`). Ajustar os valores
em `lib/shipping.ts` conforme o custo real de postagem for conhecido.

> Foi cogitado usar o Melhor Envio para cotação em tempo real, mas o
> WAF deles bloqueia acesso de fora do Brasil (loja operada do
> Paraguai) — mesmo com VPN. Tabela fixa resolve sem essa dependência;
> pode ser revisitado se alguém no Brasil gerar o token de acesso.

Fluxo: cliente digita CEP no carrinho → `POST /api/shipping` devolve
preço da região + endereço para autopreencher o formulário →
`POST /api/checkout` **recalcula no servidor** a partir do CEP (nunca
confia no preço vindo do cliente). Frete grátis acima de R$199
continua valendo — quando aplicável, o valor é zerado automaticamente.

## Roadmap

- [x] Fase 1 — loja + checkout (Mercado Pago sandbox, depois migrado para Stripe)
- [x] Fase 2 — pedidos no Neon Postgres, painel admin (status + código de rastreio), página de acompanhamento do cliente via link com token
- [x] Fase 3a — cálculo de frete por região (tabela fixa via BrasilAPI)
- [x] Fase 3c — coleta de endereço própria + checkout via WhatsApp/Pix (conta Stripe pendente de verificação)
- [ ] Fase 3b — cotação/etiqueta automática (Melhor Envio ou similar, se o acesso for viabilizado) + e-mail transacional
