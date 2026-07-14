import Store from "@/components/Store";
import { getProducts } from "@/lib/products";

export const revalidate = 60; // catálogo do Sanity revalida a cada 60s

export default async function Home() {
  const products = await getProducts();
  return <Store products={products} />;
}
