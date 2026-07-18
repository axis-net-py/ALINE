"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import type { ShippingOption } from "@/lib/shipping";

const FREE_SHIP = 199;
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Cart = Record<string, number>;

export default function Store({ products }: { products: Product[] }) {
  const cats = useMemo(() => ["Todos", ...new Set(products.map((p) => p.cat))], [products]);
  const [cart, setCart] = useState<Cart>({});
  const [activeCat, setActiveCat] = useState("Todos");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [toast, setToast] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[] | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLElement>(null);

  const filtered = products.filter(
    (p) => (activeCat === "Todos" || p.cat === activeCat) && p.name.toLowerCase().includes(query.toLowerCase())
  );
  const byId = (id: string) => products.find((p) => p.id === id)!;
  const total = Object.entries(cart).reduce((s, [id, q]) => s + byId(id).price * q, 0);
  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  const freeShipping = total >= FREE_SHIP;
  const selectedShipping = shippingOptions?.find((o) => o.id === selectedShippingId) ?? null;
  const shippingCharge = selectedShipping ? (freeShipping ? 0 : selectedShipping.price) : 0;
  const grandTotal = total + shippingCharge;
  const cartKey = Object.entries(cart).map(([id, q]) => `${id}:${q}`).join(",");

  /* cotação de frete: recalcula quando o carrinho muda */
  useEffect(() => {
    setShippingOptions(null);
    setSelectedShippingId(null);
    setShippingError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey]);

  const fetchShipping = async () => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) { setShippingError("CEP inválido"); return; }
    setShippingLoading(true);
    setShippingError("");
    setShippingOptions(null);
    setSelectedShippingId(null);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: digits, items: Object.entries(cart).map(([id, qty]) => ({ id, qty })) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setShippingError(data.error === "invalid_cep" ? "CEP não encontrado" : "Não consegui calcular o frete agora. Tente de novo.");
        return;
      }
      const options: ShippingOption[] = data.options ?? [];
      setShippingOptions(options);
      if (options.length === 0) setShippingError("Nenhuma opção de entrega para esse CEP.");
      else setSelectedShippingId(options[0].id);
      if (data.address) {
        setAddrLine1(data.address.street || "");
        setAddrLine2(data.address.neighborhood || "");
        setAddrCity(data.address.city || "");
        setAddrState(data.address.state || "");
      }
    } catch {
      setShippingError("Não consegui calcular o frete agora. Tente de novo.");
    } finally {
      setShippingLoading(false);
    }
  };

  /* localStorage — descarta itens que saíram do catálogo */
  useEffect(() => {
    try {
      const saved: Cart = JSON.parse(localStorage.getItem("venustas-cart") || "{}");
      const valid = Object.fromEntries(
        Object.entries(saved).filter(([id]) => products.some((p) => p.id === id))
      );
      setCart(valid);
    } catch {}
  }, [products]);
  const persist = (updater: (prev: Cart) => Cart) =>
    setCart((prev) => {
      const c = updater(prev);
      localStorage.setItem("venustas-cart", JSON.stringify(c));
      return c;
    });

  const addToCart = (id: string, q: number) => {
    persist((prev) => ({ ...prev, [id]: (prev[id] || 0) + q }));
    showToast(`${byId(id).name} no carrinho`);
    const el = document.getElementById("cartCount");
    if (el) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
  };
  const setQty = (id: string, q: number) =>
    persist((prev) => {
      const c = { ...prev };
      if (q <= 0) delete c[id]; else c[id] = q;
      return c;
    });
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  /* efeitos globais: preloader, cursor, header, parallax, marquee */
  useEffect(() => {
    const t = setTimeout(() => document.body.classList.add("loaded"), 900);
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
      const cx = e.clientX / innerWidth - 0.5, cy = e.clientY / innerHeight - 0.5;
      document.querySelectorAll<HTMLElement>(".hero-float").forEach((el) => {
        const d = +(el.dataset.depth || 0);
        el.style.transform = `translate(${cx * d}px,${cy * d}px)`;
      });
    };
    const lerp = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      ring?.classList.toggle("hovering", !!t.closest("a,button,input,[data-hover]"));
      const art = t.closest(".card-art");
      ring?.classList.toggle("view", !!art);
      if (ring) ring.textContent = art ? "ver" : "";
    };
    const onScroll = () => document.querySelector("header")?.classList.toggle("scrolled", scrollY > 40);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("scroll", onScroll, { passive: true });
    /* marquee: velocidade constante ~55px/s */
    const track = document.getElementById("marqueeTrack");
    if (track) track.style.animationDuration = track.scrollWidth / 2 / 55 + "s";
    return () => {
      clearTimeout(t); cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* reveal no scroll */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".card,.benefit,.quote blockquote").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered.length]);

  /* esc fecha tudo */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setDrawerOpen(false); setModalProduct(null); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = drawerOpen || modalProduct ? "hidden" : "";
  }, [drawerOpen, modalProduct]);

  // se a cotação trouxe opções, o cliente precisa escolher uma antes de pagar
  const shippingPending = !!shippingOptions && shippingOptions.length > 0 && !selectedShippingId;
  const addressPending =
    cep.replace(/\D/g, "").length !== 8 ||
    !addrName.trim() || !addrPhone.trim() || !addrLine1.trim() || !addrCity.trim() || !addrState.trim();

  /* checkout: cria pedido com endereço; Stripe se configurado, senão WhatsApp (Pix manual) */
  const checkout = async () => {
    setCheckingOut(true);
    try {
      const digits = cep.replace(/\D/g, "");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: Object.entries(cart).map(([id, qty]) => ({ id, qty })),
          shipping: selectedShippingId && digits.length === 8 ? { serviceId: selectedShippingId, cep: digits } : null,
          address: {
            name: addrName, phone: addrPhone, line1: addrLine1, line2: addrLine2 || undefined,
            city: addrCity, state: addrState, postalCode: digits,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) { window.location.href = data.url; return; }
      if (res.ok && data.whatsapp_url) { window.location.href = data.whatsapp_url; return; }
      showToast("Não consegui finalizar. Confira os dados e tente de novo.");
    } catch {
      showToast("Não consegui finalizar. Confira os dados e tente de novo.");
    } finally {
      setCheckingOut(false);
    }
  };

  const openModal = (p: Product) => { setModalProduct(p); setModalQty(1); };

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />

      <Preloader />

      <header>
        <div className="header-inner">
          <a className="logo" href="#" data-hover>
            <svg className="logo-mark" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M24 10c-4.4 0-8 3.6-8 8 0 3.1 1.8 5.8 4.4 7.2-.3 2.6-1.5 4.6-3.4 6.3 2.3.6 4.7.3 7-.9 2.3 1.2 4.7 1.5 7 .9-1.9-1.7-3.1-3.7-3.4-6.3 2.6-1.4 4.4-4.1 4.4-7.2 0-4.4-3.6-8-8-8z" fill="currentColor" opacity=".9" />
            </svg>
            <span className="logo-text">VENUSTAS<small>Beauty</small></span>
          </a>
          <nav className="main-nav">
            <a href="#produtos" data-hover>Produtos</a>
            <a href="#beneficios" data-hover>Por quê nós</a>
          </nav>
          <div className="header-actions">
            <div className="search">
              <input type="search" placeholder="Buscar produtos…" aria-label="Buscar produtos"
                value={query} onChange={(e) => setQuery(e.target.value)} />
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </div>
            <button className="cart-btn" onClick={() => setDrawerOpen(true)} data-hover aria-label="Abrir carrinho">
              <span>Carrinho</span> <span className="cart-count" id="cartCount">{count}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="hero" id="hero">
        <p className="hero-kicker">Maquiagem &amp; cosméticos</p>
        <h1>
          <span className="line"><span>Beleza não</span></span>
          <span className="line"><span>se <em>esconde</em> —</span></span>
          <span className="line"><span>se <span className="outline">revela</span>.</span></span>
        </h1>
        <div className="hero-bottom">
          <p className="hero-sub">Curadoria de maquiagens e cosméticos das marcas que você ama. Frete grátis acima de R$199 e novidades toda semana.</p>
          <a className="hero-cta" href="#produtos" data-hover>Explorar loja <span className="circle">↓</span></a>
        </div>
        <span className="hero-float f1" data-depth="26">💄</span>
        <span className="hero-float f2" data-depth="14">✨</span>
        <span className="hero-float f3" data-depth="40">🌹</span>
        <div className="hero-scroll" aria-hidden="true">scroll</div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track" id="marqueeTrack">
          {[0, 1].map((i) => (
            <span key={i}>
              <span>Frete grátis acima de R$199</span><em>✦</em>
              <span>Pagamento por Pix</span><em>✦</em>
              <span>Novidades toda semana</span><em>✦</em>
              <span>Curadoria de maquiagem e cosméticos</span><em>✦</em>
            </span>
          ))}
        </div>
      </div>

      <div className="section-head" id="produtos">
        <h2>Nossa <em>seleção</em></h2>
        <p>Cada produto passa pela nossa curadoria. Só entra o que a gente usaria — e usa.</p>
      </div>

      <nav className="filters" aria-label="Categorias">
        {cats.map((c) => (
          <button key={c} className={`chip${c === activeCat ? " active" : ""}`} data-hover
            onClick={() => setActiveCat(c)}>{c}</button>
        ))}
      </nav>

      <main className="grid" ref={gridRef}>
        {filtered.length === 0 && <p className="empty">Nenhum produto encontrado…</p>}
        {filtered.map((p, i) => (
          <article className="card" key={p.id} style={{ transitionDelay: `${Math.min(i * 55, 440)}ms` }}>
            <div className={`card-art${p.image ? " has-photo" : ""}`} style={{ background: p.image ? "#fff" : p.art }}
              onClick={(e) => { if (!(e.target as HTMLElement).closest(".quick-view")) openModal(p); }}>
              {p.badge && <span className="badge">{p.badge}</span>}
              {p.image
                ? <img className="photo" src={p.image} alt={p.name} loading="lazy" />
                : <span className="emoji">{p.emoji}</span>}
              <button className="quick-view" onClick={() => openModal(p)}>Ver detalhes</button>
            </div>
            <div className="card-body">
              <span className="card-cat">{p.cat}</span>
              <h3 className="card-name">{p.name}</h3>
              <div className="card-price">
                <strong>{brl(p.price)}</strong>{p.old && <s>{brl(p.old)}</s>}
              </div>
              <button className="add-btn" data-hover onClick={() => addToCart(p.id, 1)}>
                <span>Adicionar ao carrinho</span>
              </button>
            </div>
          </article>
        ))}
      </main>

      <section className="benefits" id="beneficios">
        <div className="benefits-inner">
          {[
            ["(01)", "Frete grátis", "Acima de R$199 para todo o Brasil. Rastreio em tempo real do pedido até a sua porta."],
            ["(02)", "Pix pelo WhatsApp", "Finalize seu pedido e combine o pagamento por Pix direto com a gente."],
            ["(03)", "Cruelty free", "Só trabalhamos com marcas que não testam em animais. Beleza sem culpa."],
            ["(04)", "Atendimento direto", "Chegou errado ou com defeito? Fala com a gente pelo WhatsApp, resolvemos caso a caso."],
          ].map(([num, h, p]) => (
            <div className="benefit" key={num}>
              <span className="num">{num}</span><h3>{h}</h3><p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      <figure className="quote">
        <blockquote>&ldquo;Maquiagem não é máscara. É <em>assinatura</em>.&rdquo;</blockquote>
        <figcaption>— Manifesto Venustas</figcaption>
      </figure>

      {/* modal quick view */}
      <div className={`modal-overlay${modalProduct ? " open" : ""}`} onClick={() => setModalProduct(null)} />
      <div className={`modal${modalProduct ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Detalhes do produto">
        {modalProduct && (
          <>
            <button className="modal-close" onClick={() => setModalProduct(null)} aria-label="Fechar">×</button>
            <div className="modal-art" style={{ background: modalProduct.image ? "#fff" : modalProduct.art }}>
              {modalProduct.image
                ? <img className="photo" src={modalProduct.image} alt={modalProduct.name} />
                : modalProduct.emoji}
            </div>
            <div className="modal-info">
              <span className="card-cat">{modalProduct.cat}</span>
              <h3>{modalProduct.name}</h3>
              <p className="desc">{modalProduct.desc}</p>
              <div className="modal-price">
                <strong>{brl(modalProduct.price)}</strong>
                {modalProduct.old && <s>{brl(modalProduct.old)}</s>}
              </div>
              <div className="modal-qty">
                <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} aria-label="Diminuir">−</button>
                <output>{modalQty}</output>
                <button onClick={() => setModalQty(modalQty + 1)} aria-label="Aumentar">+</button>
              </div>
              <button className="modal-add" data-hover
                onClick={() => { addToCart(modalProduct.id, modalQty); setModalProduct(null); }}>
                <span>Adicionar ao carrinho</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* carrinho */}
      <div className={`overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer${drawerOpen ? " open" : ""}`} aria-label="Carrinho de compras">
        <div className="drawer-head">
          <h2>Seu <em>carrinho</em></h2>
          <button onClick={() => setDrawerOpen(false)} aria-label="Fechar carrinho">×</button>
        </div>
        <div className="ship-bar">
          <span dangerouslySetInnerHTML={{
            __html: total >= FREE_SHIP
              ? "🎉 Você ganhou <strong>frete grátis</strong>!"
              : `Faltam <strong>${brl(FREE_SHIP - total)}</strong> para frete grátis`,
          }} />
          <div className="ship-track"><div className="ship-fill" style={{ width: `${Math.min(100, (total / FREE_SHIP) * 100)}%` }} /></div>
        </div>
        <div className="cart-items">
          {count === 0 && <p className="cart-empty">Seu carrinho está vazio.<br />Que tal um batom novo?</p>}
          {Object.entries(cart).map(([id, q]) => {
            const p = byId(id);
            return (
              <div className="cart-item" key={id}>
                <div className="thumb" style={{ background: p.image ? "#fff" : p.art }}>
                  {p.image ? <img className="photo" src={p.image} alt="" /> : p.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h4>{p.name}</h4>
                  <span className="item-price">{brl(p.price)}</span>
                  <div className="qty">
                    <button onClick={() => setQty(id, q - 1)} aria-label="Diminuir">−</button>
                    <span>{q}</span>
                    <button onClick={() => setQty(id, q + 1)} aria-label="Aumentar">+</button>
                    <button className="remove" onClick={() => setQty(id, 0)}>remover</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {count > 0 && (
          <div className="shipping-box">
            <label htmlFor="cepInput">Calcular frete</label>
            <div className="shipping-row">
              <input id="cepInput" inputMode="numeric" placeholder="00000-000" maxLength={9}
                value={cep} onChange={(e) => setCep(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") fetchShipping(); }} />
              <button type="button" onClick={fetchShipping} disabled={shippingLoading} data-hover>
                {shippingLoading ? "…" : "Calcular"}
              </button>
            </div>
            {shippingError && <p className="shipping-error">{shippingError}</p>}
            {shippingOptions && shippingOptions.length > 0 && (
              <div className="shipping-options">
                {shippingOptions.map((o) => (
                  <label key={o.id} className={`shipping-option${selectedShippingId === o.id ? " active" : ""}`}>
                    <input type="radio" name="shipping" checked={selectedShippingId === o.id}
                      onChange={() => setSelectedShippingId(o.id)} />
                    <span className="shipping-option-name">{o.company} · {o.name}<br /><small>até {o.days} dias úteis</small></span>
                    <strong>{freeShipping ? "Grátis" : brl(o.price)}</strong>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
        {count > 0 && shippingOptions && shippingOptions.length > 0 && (
          <div className="address-box">
            <label>Dados de entrega</label>
            <input placeholder="Nome completo" value={addrName} onChange={(e) => setAddrName(e.target.value)} />
            <input placeholder="Telefone (WhatsApp)" value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} />
            <input placeholder="Rua e número" value={addrLine1} onChange={(e) => setAddrLine1(e.target.value)} />
            <input placeholder="Complemento / bairro" value={addrLine2} onChange={(e) => setAddrLine2(e.target.value)} />
            <div className="address-row">
              <input placeholder="Cidade" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} />
              <input placeholder="UF" maxLength={2} value={addrState} onChange={(e) => setAddrState(e.target.value.toUpperCase())} />
            </div>
          </div>
        )}
        <div className="drawer-foot">
          <div className="subtotal"><span>Subtotal</span><span>{brl(total)}</span></div>
          {selectedShipping && (
            <div className="subtotal shipping-line"><span>Frete</span><span>{freeShipping ? "Grátis" : brl(shippingCharge)}</span></div>
          )}
          {selectedShipping && <div className="subtotal total-line"><span>Total</span><span>{brl(grandTotal)}</span></div>}
          <button className="checkout" disabled={count === 0 || checkingOut || shippingPending || addressPending} data-hover onClick={checkout}>
            <span>
              {checkingOut ? "Enviando pedido…"
                : shippingPending ? "Escolha o frete"
                : addressPending ? "Complete seus dados de entrega"
                : "Finalizar pelo WhatsApp"}
            </span>
          </button>
          <p className="checkout-note">Pagamento por Pix, combinado direto pelo WhatsApp</p>
        </div>
      </aside>

      <div className={`toast${toast ? " show" : ""}`}><b>✓</b> <span>{toast || "…"}</span></div>

      <footer>
        <div className="footer-inner">
          <div className="footer-big">VENUSTAS.</div>
          <div className="footer-row">
            <span>© 2026 Venustas Beauty · Loja demonstrativa</span>
            <nav>
              <a href="#produtos" data-hover>Produtos</a>
              <a href="#beneficios" data-hover>Benefícios</a>
              <a href="#hero" data-hover>Voltar ao topo ↑</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), 900); return () => clearTimeout(t); }, []);
  return (
    <div className={`preloader${done ? " done" : ""}`} aria-hidden="true">
      <h2><span>V</span><span>E</span><span>N</span><span>U</span><span>S</span><span>T</span><span>A</span><span><i>S</i></span></h2>
    </div>
  );
}
