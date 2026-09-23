import { notifyNewRequest } from "@/lib/request-notification";
import { validPhoto, photoExtension } from "@/lib/photos";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateRequest } from "@/lib/request-validation";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 3400000)
    return NextResponse.json(
      { error: "De aanvraag is te groot." },
      { status: 413 },
    );
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }
  if (form.get("company")) return NextResponse.json({ ok: true });
  let payload: ReturnType<typeof validateRequest>;
  const photos = form
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  try {
    payload = validateRequest(form);
    if (
      photos.length > 3 ||
      photos.some((f) => f.size > 1048576) ||
      photos.reduce((n, f) => n + f.size, 0) > 3145728
    )
      throw new Error("Voeg maximaal 3 foto’s van elk maximaal 1 MB toe.");
    for (const f of photos) {
      const valid = await validPhoto(f);
      if (!valid)
        throw new Error("Gebruik een geldige JPG-, PNG- of WebP-foto.");
    }
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Controleer de ingevulde gegevens.",
      },
      { status: 400 },
    );
  }
  const db = createAdminClient(),
    paths: string[] = [];
  let requestId: string;
  try {
    for (const photo of photos) {
      const path = `${crypto.randomUUID()}/${crypto.randomUUID()}.${photoExtension(photo)}`;
      const { error } = await db.storage
        .from("request-photos")
        .upload(path, photo, { contentType: photo.type });
      if (error) throw error;
      paths.push(path);
    }
    // The migration exposes this RPC only to the server's service role.
    const { data, error } = await db.rpc("submit_mobile_request", {
      payload,
      photo_paths: paths,
    });
    if (error) throw error;
    requestId = data;
  } catch {
    if (paths.length) await db.storage.from("request-photos").remove(paths);
    return NextResponse.json(
      {
        error:
          "Opslaan is niet gelukt. Probeer het opnieuw of neem contact met ons op.",
      },
      { status: 503 },
    );
  }
  // Persistence has committed: email errors cannot trigger photo cleanup or a retry by the customer.
  try {
    await notifyNewRequest(payload, requestId, paths.length);
  } catch {
    console.error("Request notification failed after saving.");
  }
  return NextResponse.json({ ok: true });
}
