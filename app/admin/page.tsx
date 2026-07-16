import { isAdmin, login, logout, saveOrder } from "./actions";
import { listOrders, STATUSES } from "@/lib/orders";

export const dynamic = "force-dynamic";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default async function Admin({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;

  if (!process.env.ADMIN_PASSWORD) {
    return (
      <div className="status-page"><div className="box">
        <h1>Admin não <em>configurado</em></h1>
        <p>Defina ADMIN_PASSWORD no ambiente para ativar o painel.</p>
      </div></div>
    );
  }

  if (!(await isAdmin())) {
    return (
      <div className="status-page"><div className="box">
        <h1>Painel <em>ALINE</em></h1>
        {erro && <p style={{ color: "var(--rose)" }}>Senha incorreta.</p>}
        <form action={login} className="admin-login">
          <input type="password" name="password" placeholder="Senha" autoFocus required />
          <button type="submit">Entrar</button>
        </form>
      </div></div>
    );
  }

  const orders = await listOrders();
  const dbOff = !process.env.DATABASE_URL;

  return (
    <div className="admin">
      <header className="admin-head">
        <span className="logo">ALINE<i>.</i> <small>admin</small></span>
        <form action={logout}><button className="admin-logout">Sair</button></form>
      </header>

      {dbOff && <p className="admin-warn">Banco não configurado (DATABASE_URL) — pedidos não estão sendo gravados.</p>}
      {orders.length === 0 && !dbOff && <p className="admin-warn">Nenhum pedido ainda.</p>}

      <div className="admin-orders">
        {orders.map((o) => (
          <details className="admin-order" key={o.id}>
            <summary>
              <span className={`status-pill s-${o.status}`}>{o.status}</span>
              <strong>#{o.token.slice(0, 8).toUpperCase()}</strong>
              <span>{brl(o.total)}</span>
              <span className="muted">{new Date(o.created_at).toLocaleString("pt-BR")}</span>
              {o.tracking_code && <span className="muted">📦 {o.tracking_code}</span>}
            </summary>
            <div className="admin-order-body">
              <ul>
                {o.order_items?.map((i, n) => (
                  <li key={n}>{i.qty}x {i.name} — {brl(i.unit_price * i.qty)}</li>
                ))}
              </ul>
              {o.address_line1 ? (
                <p className="admin-address">
                  📍 {o.address_name}
                  {o.customer_phone && ` · ${o.customer_phone}`}
                  <br />
                  {o.address_line1}{o.address_line2 && `, ${o.address_line2}`}
                  <br />
                  {o.address_city} - {o.address_state} · CEP {o.address_postal_code}
                </p>
              ) : (
                <p className="admin-warn admin-warn-inline">Sem endereço de entrega registrado ainda.</p>
              )}
              {o.shipping_service && (
                <p className="muted">
                  Frete: {o.shipping_service} — {o.shipping_price > 0 ? brl(o.shipping_price) : "grátis"}
                </p>
              )}
              {o.customer_email && <p className="muted">Cliente: {o.customer_email}</p>}
              <form action={saveOrder} className="admin-form">
                <input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input name="tracking" placeholder="Código de rastreio" defaultValue={o.tracking_code ?? ""} />
                <button type="submit">Salvar</button>
                <a href={`/pedido/${o.token}`} target="_blank" className="muted">link do cliente ↗</a>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
