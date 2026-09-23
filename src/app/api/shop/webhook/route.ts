import { synchronizePayment } from "@/lib/shop-payments";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 1024)
    return new Response(null, { status: 413 });
  let id: string;
  try {
    id = new URLSearchParams(await request.text()).get("id") || "";
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) return new Response(null, { status: 400 });
  try {
    await synchronizePayment(id);
    return new Response(null, { status: 200 });
  } catch {
    console.error("Mollie webhook could not finish; retry required.");
    return new Response(null, { status: 503 });
  }
}
