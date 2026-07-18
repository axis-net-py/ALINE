export type ShippingOption = {
  id: string;
  name: string;
  company: string;
  price: number;
  days: number;
};

export type CepAddress = {
  street: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
};

export type ShippingResult =
  | { ok: true; options: ShippingOption[]; address: CepAddress }
  | { ok: false; reason: "invalid_cep" | "api_error" };

const CEP_RE = /^\d{8}$/;

// Tabela fixa por região a partir de Belém-PA. Substitui a cotação via
// Melhor Envio (bloqueada pelo WAF deles para acesso fora do Brasil).
// Preço e prazo são estimativas — ajustar com base no custo real de
// postagem observado nos primeiros pedidos.
const REGIONS: Record<string, { price: number; days: number }> = {
  norte: { price: 15.9, days: 6 },
  nordeste: { price: 24.9, days: 9 },
  centro_oeste: { price: 27.9, days: 10 },
  sudeste: { price: 31.9, days: 11 },
  sul: { price: 34.9, days: 13 },
};

const STATE_REGION: Record<string, keyof typeof REGIONS> = {
  AC: "norte", AM: "norte", AP: "norte", PA: "norte", RO: "norte", RR: "norte", TO: "norte",
  AL: "nordeste", BA: "nordeste", CE: "nordeste", MA: "nordeste", PB: "nordeste",
  PE: "nordeste", PI: "nordeste", RN: "nordeste", SE: "nordeste",
  DF: "centro_oeste", GO: "centro_oeste", MT: "centro_oeste", MS: "centro_oeste",
  ES: "sudeste", MG: "sudeste", RJ: "sudeste", SP: "sudeste",
  PR: "sul", RS: "sul", SC: "sul",
};

export async function calculateShipping(
  destCep: string,
  _items: { id: string; qty: number }[]
): Promise<ShippingResult> {
  const cep = destCep.replace(/\D/g, "");
  if (!CEP_RE.test(cep)) return { ok: false, reason: "invalid_cep" };

  let data: { state: string; city: string; street?: string; neighborhood?: string };
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
    if (!res.ok) return { ok: false, reason: "invalid_cep" };
    data = await res.json();
  } catch (e) {
    console.error("[shipping] BrasilAPI falhou:", e);
    return { ok: false, reason: "api_error" };
  }

  const region = STATE_REGION[data.state];
  if (!region) return { ok: false, reason: "invalid_cep" };
  const { price, days } = REGIONS[region];

  return {
    ok: true,
    options: [{ id: "padrao", name: "Entrega padrão", company: "VENUSTAS", price, days }],
    address: {
      street: data.street || null,
      neighborhood: data.neighborhood || null,
      city: data.city,
      state: data.state,
    },
  };
}
