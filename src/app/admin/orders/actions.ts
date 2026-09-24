"use server";
import { syncMoneybirdOrder } from "@/lib/moneybird-sync";
import { crmClient } from "@/lib/crm";
import { revalidatePath } from "next/cache";
export async function markShipped(form: FormData) {
  const db = await crmClient();
  const id = String(form.get("id") || ""),
    tracking = String(form.get("tracking") || "").trim();
  if (tracking.length > 200) throw new Error("Track & trace is te lang.");
  const { data, error } = await db
    .from("shop_orders")
    .update({
      fulfillment_status: "shipped",
      tracking_reference: tracking || null,
    })
    .eq("id", id)
    .eq("status", "paid")
    .eq("payment_mode", "live")
    .select("id")
    .single();
  if (error || !data)
    throw new Error(
      "Alleen een betaalde livebestelling kan als verzonden worden gemarkeerd.",
    );
  revalidatePath("/admin/orders");
}

export async function retryMoneybird(form: FormData) {
  await crmClient();
  const id = String(form.get("id") || "");
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw new Error("Ongeldige bestelling.");
  try { await syncMoneybirdOrder(id); } catch {
    // The persistent export status explains the failure in the order list.
    console.warn("Moneybird export needs attention; consult order status.");
  }
  revalidatePath("/admin/orders");
}
