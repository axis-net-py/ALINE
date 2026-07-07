import Link from "next/link";
import { getOrderByToken, type OrderStatus } from "@/lib/orders";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const TIMELINE: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "pago", label: "Pagamento confirmado", icon: "💳" },
  { key: "separando", label: "Separando seu pedido", icon: "📦" },
  { key: "enviado", label: "Enviado", icon: "🚚" },
  { key: "entregue", label: "Entregue", icon: "🎉" },
];

export default async function Pedido({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByToken(token);

  if (!order) {
    return (
      <div className="status-page">
        <div className="box">
          <h1>Pedido não <em>encontrado</em></h1>
          <p>Confira o link que você recebeu — ou fale com a gente pelo WhatsApp.</p>
          <Link href="/">Voltar à loja</Link>
        </div>
      </div>
    );
  }

  const cancelled = order.status === "cancelado";
  const stepIndex = TIMELINE.findIndex((t) => t.key === order.status);
  const activeIndex = order.status === "pendente" ? -1 : stepIndex;

  return (
    <div className="order-page">
      <header className="order-head">
        <Link className="logo" href="/">ALINE<i>.</i></Link>
      </header>
      <main className="order-box">
        <span className="card-cat">Pedido #{order.token.slice(0, 8).toUpperCase()}</span>
        <h1>
          {cancelled ? <>Pedido <em>cancelado</em></> :
           order.status === "pendente" ? <>Aguardando <em>pagamento</em></> :
           order.status === "entregue" ? <>Pedido <em>entregue</em>!</> :
           <>Acompanhe seu <em>pedido</em></>}
        </h1>

        {!cancelled && (
          <ol className="timeline">
            {TIMELINE.map((t, i) => (
              <li key={t.key} className={i <= activeIndex ? "done" : ""}>
                <span className="dot">{t.icon}</span>
                <span>{t.label}</span>
              </li>
            ))}
          </ol>
        )}

        {order.tracking_code && (
          <div className="tracking">
            <strong>Código de rastreio:</strong> <code>{order.tracking_code}</code>
            <a href={`https://www.linkcorreios.com.br/${order.tracking_code}`} target="_blank" rel="noopener noreferrer">
              Rastrear nos Correios ↗
            </a>
          </div>
        )}

        <div className="order-items">
          {order.order_items?.map((i, n) => (
            <div className="order-item" key={n}>
              <span>{i.qty}x {i.name}</span>
              <span>{brl(i.unit_price * i.qty)}</span>
            </div>
          ))}
          <div className="order-item total">
            <span>Total</span>
            <span>{brl(order.total)}</span>
          </div>
        </div>

        <p className="order-date">
          Pedido feito em {new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </p>
        <Link className="order-back" href="/">Voltar à loja</Link>
      </main>
    </div>
  );
}
