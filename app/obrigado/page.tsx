import Link from "next/link";
import ClearCart from "./ClearCart";

const COPY: Record<string, { title: React.ReactNode; text: string }> = {
  success: {
    title: <>Pedido <em>confirmado</em>! 💄</>,
    text: "Pagamento aprovado. Você vai receber os detalhes do pedido e, assim que enviarmos, o código de rastreio. Obrigada por comprar com a gente!",
  },
  pending: {
    title: <>Quase <em>lá</em>…</>,
    text: "Seu pagamento está em processamento (Pix e boleto podem levar alguns instantes). Assim que confirmar, avisamos por e-mail.",
  },
  failure: {
    title: <>Algo deu <em>errado</em></>,
    text: "O pagamento não foi concluído. Nenhum valor foi cobrado — seu carrinho continua salvo, é só tentar de novo.",
  },
};

export default async function Obrigado({
  searchParams,
}: { searchParams: Promise<{ status?: string; pedido?: string }> }) {
  const { status, pedido } = await searchParams;
  const copy = COPY[status ?? ""] ?? COPY.pending;
  const paid = status === "success";
  return (
    <div className="status-page">
      <div className="box">
        <h1>{copy.title}</h1>
        <p>{copy.text}</p>
        {pedido && status !== "failure" && (
          <p>
            Acompanhe tudo por aqui:{" "}
            <Link className="order-link" href={`/pedido/${pedido}`}>página do seu pedido</Link>
            {" "}— salve o link!
          </p>
        )}
        <Link href="/">Voltar à loja</Link>
      </div>
      {paid && <ClearCart />}
    </div>
  );
}
