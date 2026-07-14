export type Product = {
  id: string;
  name: string;
  cat: string;
  price: number;
  old: number | null;
  emoji: string;
  art: string;
  image: string | null;
  badge: string | null;
  desc: string;
};

// Catálogo Jessi Make (fornecedor) — preço de venda = custo × 2 arredondado.
// Custo em comentário para referência de margem.
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Kit c/3 Sabonete Hidratante Mãos e Corpo — Extrato de Algodão · Mia Make",
    cat: "Corpo", price: 33.9, old: null, // custo 16,80
    emoji: "🧼", art: "linear-gradient(135deg,#FDF0E0,#E6C39A)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1776258349439-pinac33.jpg",
    badge: "Kit c/3",
    desc: "Trio de sabonetes com extrato de algodão que limpa sem ressecar. Espuma cremosa, perfume suave de roupa limpa — mãos e corpo macios o dia todo.",
  },
  {
    id: "2",
    name: "Pó Compacto Matte Vegano · Max Love",
    cat: "Rosto", price: 5.99, old: null, // custo 2,99
    emoji: "🪞", art: "linear-gradient(135deg,#FFE8D9,#EFA98C)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1668182496557-1.png",
    badge: "Vegano",
    desc: "Acabamento matte sequinho que segura o brilho por horas. Fórmula vegana, textura fininha que não marca linhas — o queridinho do retoque rápido.",
  },
  {
    id: "3",
    name: "Esfoliante Corporal Morango 200ml",
    cat: "Corpo", price: 14.9, old: null, // custo 7,20
    emoji: "🍓", art: "linear-gradient(135deg,#FCE4EC,#F06595)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1720452637673-esfoliantemorango.jpg",
    badge: null,
    desc: "Esfoliação suave com cheirinho de morango que renova a pele sem agredir. Use no banho 2x por semana e sinta a diferença na primeira vez.",
  },
  {
    id: "4",
    name: "Kit c/3 Depilador de Cristal Indolor — Cores Sortidas",
    cat: "Corpo", price: 59.9, old: null, // custo 29,90
    emoji: "💎", art: "linear-gradient(135deg,#E5DBFF,#B197FC)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1664382295593-530e03510daa2e15e6a222689ea55ee5.jpg",
    badge: "Kit c/3",
    desc: "Depilação sem dor, sem cera e sem lâmina: o cristal remove os pelos por fricção suave e ainda esfolia. Reutilizável e lavável.",
  },
  {
    id: "5",
    name: "Kit c/3 Gel Beijável para Virilha 180g Menta · Phállebeauty",
    cat: "Corpo", price: 59.9, old: null, // custo 29,97
    emoji: "🌿", art: "linear-gradient(135deg,#D3F3DF,#4CAF7D)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1747859080468-gel1.jpg",
    badge: "Kit c/3",
    desc: "Gel aromatizante refrescante de menta, dermatologicamente testado. Sensação gelada, perfume leve e toque seco.",
  },
  {
    id: "6",
    name: "Progressiva de Chuveiro · Isis Makeup",
    cat: "Cabelo", price: 15.9, old: null, // custo 7,99
    emoji: "🚿", art: "linear-gradient(135deg,#D0EBFF,#339AF0)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1745581865405-progressiva.jpg",
    badge: null,
    desc: "Alisamento e redução de volume direto no banho, sem formol e sem prancha. Aplica, age e enxágua — fios alinhados com brilho de salão.",
  },
  {
    id: "7",
    name: "Gel Esfoliante Facial com Pedras Vulcânicas · Dermachem",
    cat: "Skincare", price: 14.9, old: null, // custo 7,11
    emoji: "🌋", art: "linear-gradient(135deg,#FFE8CC,#FD7E14)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1615250526463-9c99c0c523b1ab4d88d0d77856386ffeawsaccesskeyidakiatclmsgfx4g7qtfvdexpires1615855324signaturebmi5akxdy1liqnknwiteygdr2li3d.jpg",
    badge: null,
    desc: "Micropartículas de pedras vulcânicas que desobstruem os poros e removem células mortas. Pele lisa e luminosa sem ressecar.",
  },
  {
    id: "8",
    name: "Paleta de Sombras Matte Seu Estilo · Ludurana",
    cat: "Sombra", price: 19.9, old: null, // custo 10,24
    emoji: "🎨", art: "linear-gradient(135deg,#FFD8A8,#E8590C)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1650910821622-b002213.png",
    badge: "Best-seller",
    desc: "Tons matte versáteis do neutro ao marcante, com pigmentação de verdade e esfumado fácil. Do look de trabalho à balada com uma paleta só.",
  },
  {
    id: "9",
    name: "Kit c/6 Batom Mágico Colorido · Vivai",
    cat: "Batom", price: 21.9, old: null, // custo 11,22
    emoji: "💄", art: "linear-gradient(135deg,#F6D9E2,#F783AC)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1701691966436-h.png",
    badge: "Kit c/6",
    desc: "O batom que muda de cor com o pH da sua pele: aplica colorido, vira um rosa único seu. Kit com 6 — um para cada bolsa, nécessaire e humor.",
  },
];

// Sanity quando configurado (SANITY_PROJECT_ID no env), senão catálogo local.
export async function getProducts(): Promise<Product[]> {
  const projectId = process.env.SANITY_PROJECT_ID;
  if (!projectId) return FALLBACK_PRODUCTS;
  const { createClient } = await import("@sanity/client");
  const client = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2025-01-01",
    useCdn: true,
  });
  const query = `*[_type == "product" && stock > 0] | order(name asc) {
    "id": _id, name, "cat": category, price, "old": oldPrice,
    emoji, art, "image": imageUrl, badge, "desc": description
  }`;
  return client.fetch<Product[]>(query);
}
