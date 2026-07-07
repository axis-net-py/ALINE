"use server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { STATUSES, updateOrder, type OrderStatus } from "@/lib/orders";

// Cookie = HMAC da senha com ela mesma como chave: valor estável,
// não expõe a senha. Suficiente para painel de 1 pessoa; trocar por
// auth de verdade se houver mais operadores.
function expectedToken(password: string) {
  return createHmac("sha256", password).update("aline-admin").digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const cookie = (await cookies()).get("aline_admin")?.value ?? "";
  const expected = expectedToken(password);
  if (cookie.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(cookie), Buffer.from(expected));
}

export async function login(formData: FormData) {
  const password = process.env.ADMIN_PASSWORD;
  const attempt = String(formData.get("password") ?? "");
  if (!password || attempt !== password) {
    redirect("/admin?erro=1");
  }
  (await cookies()).set("aline_admin", expectedToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/admin",
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete("aline_admin");
  redirect("/admin");
}

export async function saveOrder(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as OrderStatus;
  const tracking = String(formData.get("tracking") ?? "").trim();
  if (!STATUSES.includes(status)) return;
  await updateOrder(id, { status, tracking_code: tracking || null });
  revalidatePath("/admin");
}
