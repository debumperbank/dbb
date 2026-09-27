"use server";
import { sendOrderEmail } from "@/lib/order-emails";
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
  try { await sendOrderEmail(id, "shipped"); }
  catch { console.warn("Shipment saved; customer email needs review in orders."); }
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

export async function retryCustomerEmail(form: FormData) {
  await crmClient();
  const id = String(form.get("id") || "");
  const kind = String(form.get("kind") || "");
  if (!/^[a-f0-9-]{36}$/i.test(id) || !["confirmation", "shipped"].includes(kind)) throw new Error("Ongeldige bestelling.");
  try { await sendOrderEmail(id, kind as "confirmation" | "shipped"); }
  catch { console.warn("Customer email needs review in orders."); }
  revalidatePath("/admin/orders");
}
