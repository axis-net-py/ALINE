"use client";
import { useEffect } from "react";

// Pagamento aprovado: esvazia o carrinho salvo.
export default function ClearCart() {
  useEffect(() => {
    localStorage.removeItem("venustas-cart");
  }, []);
  return null;
}
