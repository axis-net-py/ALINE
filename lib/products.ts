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
  {
    id: "10",
    name: "Hidratante Primer Facial Make Up · Derma Chem",
    cat: "Skincare", price: 19.9, old: null, // custo 9,54
    emoji: "💧", art: "linear-gradient(135deg,#D0EBFF,#74C0FC)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1715252676867-hid.jpg",
    badge: "2 em 1",
    desc: "Hidrata e prepara a pele para a maquiagem em um passo só. Poros disfarçados, base desliza e dura mais — sua make começa bem aqui.",
  },
  {
    id: "11",
    name: "Sabonete Ácido Salicílico Íons · Derma Chem",
    cat: "Skincare", price: 17.9, old: null, // custo 8,71
    emoji: "🧴", art: "linear-gradient(135deg,#E7F5E8,#69B36B)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1621953111073-4d20719699.jpg",
    badge: null,
    desc: "Limpeza profunda para pele oleosa e com tendência a cravos e espinhas. Ácido salicílico desobstrui os poros sem deixar a pele repuxada.",
  },
  {
    id: "12",
    name: "Sabonete Demaquilante Pós Maquiagem Make Out · Derma Chem",
    cat: "Skincare", price: 15.9, old: null, // custo 7,99
    emoji: "🫧", art: "linear-gradient(135deg,#FFF3E2,#F1D3AE)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1614307297793-921311d17737b650e39709c4a12b5ef9awsaccesskeyidakiatclmsgfx4g7qtfvdexpires1614912094signaturez7zci2baem0j19p8b3wyyxvf0wjs3d.jpg",
    badge: null,
    desc: "Remove maquiagem, até a mais resistente, sem esfregar e sem ressecar. O passo que faltava antes de dormir com a pele limpa de verdade.",
  },
  {
    id: "13",
    name: "Quarteto de Blush · Ludurana",
    cat: "Rosto", price: 20.9, old: null, // custo 10,40
    emoji: "🌸", art: "linear-gradient(135deg,#FFE3D5,#FF922B)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1650660115663-quarteto-blush-ludurana-b00032.jpg",
    badge: null,
    desc: "Quatro tons de blush num estojo só, do rosado suave ao pêssego intenso. Mistura fácil para achar a cor exata do seu dia.",
  },
  {
    id: "14",
    name: "Lip Tint Efeito Natural · Ludurana",
    cat: "Batom", price: 15.9, old: null, // custo 7,68
    emoji: "👄", art: "linear-gradient(135deg,#FFE0E9,#E8508A)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1781099892068-pitanga.jpg",
    badge: null,
    desc: "Cor com efeito de mordida de fruta, aquele rosado que parece ter nascido com você. Longa duração, textura leve, sem ressecar os lábios.",
  },
  {
    id: "15",
    name: "Liso Perfeito Spray Anti-Frizz 120ml · Porán",
    cat: "Cabelo", price: 20.9, old: null, // custo 10,35
    emoji: "💨", art: "linear-gradient(135deg,#E5DBFF,#9775FA)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1736447928500-liso.png",
    badge: null,
    desc: "Borrifou, alisou. Controla o frizz e disciplina os fios em segundos, sem enxágue. Cabelo liso e com brilho até em dia de umidade alta.",
  },
  {
    id: "16",
    name: "Kit c/3 Body Splash Maracujá · Dermachem",
    cat: "Perfume", price: 49.9, old: null, // custo 25,88
    emoji: "🌼", art: "linear-gradient(135deg,#FFF3BF,#FCC419)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1775057234458-bodyc3.jpg",
    badge: "Kit c/3",
    desc: "Perfume corporal doce e tropical de maracujá, daqueles que deixam rastro por onde passa. Trio para deixar em casa, no trabalho e na bolsa.",
  },
  {
    id: "17",
    name: "Gloss Black Rain · Max Love",
    cat: "Batom", price: 18.9, old: null, // custo 9,64
    emoji: "✨", art: "linear-gradient(135deg,#2B2B2B,#6C6C6C)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1695929578672-b71.jpg",
    badge: null,
    desc: "Brilho intenso com um toque escuro e sofisticado, para quem quer sair do óbvio. Não é pegajoso, dura o suficiente para uma noite inteira.",
  },
  {
    id: "18",
    name: "Gel Facial Peel Off Rosa Mosqueta 60g · Derma Chem",
    cat: "Skincare", price: 13.9, old: null, // custo 6,63
    emoji: "🌹", art: "linear-gradient(135deg,#FFE3EC,#F783AC)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1614375941006-7cb7b4a3233d1491976f9123c088c214awsaccesskeyidakiatclmsgfx4g7qtfvdexpires1614980737signatureznbpf2gutgnk2dktic0gv5tg1tk3d.jpg",
    badge: null,
    desc: "Aplica, seca, descola: e sai levando cravos e impurezas junto. Rosa mosqueta deixa a pele com aquele viço de máscara de spa.",
  },
  {
    id: "19",
    name: "Água Micelar Rosa Mosqueta 250ml · Derma Chem",
    cat: "Skincare", price: 17.9, old: null, // custo 8,13
    emoji: "💦", art: "linear-gradient(135deg,#FFE8EE,#F3A0C2)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1623765372528-16016739085f779ab464e6b.jpg",
    badge: null,
    desc: "Remove maquiagem e limpa em um passo, sem precisar enxaguar. Rosa mosqueta cuida da pele enquanto tira até a máscara mais teimosa.",
  },
  {
    id: "20",
    name: "Depilador Elétrico · Lukton",
    cat: "Corpo", price: 59.9, old: null, // custo 29,90
    emoji: "🔋", art: "linear-gradient(135deg,#E9ECEF,#868E96)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1766409879365-depiladorluk.jpg",
    badge: null,
    desc: "Depilação rápida sem fio, sem cera e sem agendar salão. Cabeça giratória que arranca pelos finos direto pela raiz.",
  },
  {
    id: "21",
    name: "Combo Porán Bumbum — Creme Firmador e Esfoliante",
    cat: "Corpo", price: 37.9, old: null, // custo 18,58
    emoji: "🍑", art: "linear-gradient(135deg,#FFE3D5,#FF922B)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1758292666308-bumbum.png",
    badge: "Combo",
    desc: "Dupla para a rotina de cuidado corporal: esfolia para renovar e depois firma para tonificar. Use junto e sinta a pele mais lisa e uniforme.",
  },
  {
    id: "22",
    name: "Kit c/3 Sabonete Corporal Melancia",
    cat: "Corpo", price: 33.9, old: null, // custo 17,10
    emoji: "🍉", art: "linear-gradient(135deg,#D3F3DF,#69DB7C)",
    image: "https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/1225/@v3/1720210138666-b002651.png",
    badge: "Kit c/3",
    desc: "Espuma leve com aquele cheirinho refrescante de melancia. Trio que rende semanas de banho gostoso sem ressecar a pele.",
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
