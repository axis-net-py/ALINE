"use client";
import { useEffect } from "react";

// Pagamento aprovado: esvazia o carrinho salvo.
export default function ClearCart() {
  useEffect(() => {
    localStorage.removeItem("aline-cart");
  }, []);
  return null;
}
