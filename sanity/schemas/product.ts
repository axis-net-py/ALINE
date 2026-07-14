// Schema do produto para o Sanity Studio.
// Uso: crie o studio com `npm create sanity@latest`, copie este arquivo
// para schemas/ e registre no schema index. Depois preencha
// SANITY_PROJECT_ID e SANITY_DATASET no .env do site.
import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Produto",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
      options: { list: ["Batom", "Base", "Sombra", "Olhos", "Skincare", "Pincéis", "Perfume", "Rosto"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "price", title: "Preço (R$)", type: "number", validation: (r) => r.required().positive() }),
    defineField({ name: "oldPrice", title: "Preço antigo (riscado)", type: "number" }),
    defineField({ name: "description", title: "Descrição", type: "text", rows: 3 }),
    defineField({ name: "stock", title: "Estoque", type: "number", initialValue: 0, validation: (r) => r.required().min(0) }),
    defineField({ name: "badge", title: "Selo (ex: -20%, Best-seller)", type: "string" }),
    defineField({ name: "emoji", title: "Emoji (placeholder visual)", type: "string", initialValue: "💄" }),
    defineField({
      name: "imageUrl",
      title: "URL da foto do produto",
      type: "url",
      description: "Foto do fornecedor ou própria; sem foto o card usa emoji + gradiente",
    }),
    defineField({
      name: "art",
      title: "Gradiente CSS do card (fallback sem foto)",
      type: "string",
      initialValue: "linear-gradient(135deg,#F6D9E2,#F783AC)",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category" },
  },
});
