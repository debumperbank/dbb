import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validPhoto, photoExtension } from "@/lib/photos";
export async function POST(request: Request) {
  const auth = await createClient();
  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();
  if (authError || !user)
    return NextResponse.json({ error: "Log opnieuw in." }, { status: 401 });
  if (Number(request.headers.get("content-length") || 0) > 1100000)
    return NextResponse.json(
      { error: "De foto is te groot." },
      { status: 413 },
    );
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ongeldige upload." }, { status: 400 });
  }
  const id = String(form.get("appointment_id") || ""),
    stage = String(form.get("stage") || ""),
    photo = form.get("photo");
  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !["before", "during", "after"].includes(stage) ||
    !(photo instanceof File) ||
    !(await validPhoto(photo))
  )
    return NextResponse.json(
      {
        error:
          "Kies een JPG-, PNG- of WebP-foto van maximaal 1 MB en een geldige fase.",
      },
      { status: 400 },
    );
  const db = createAdminClient();
  const { data: appointment, error } = await db
    .from("appointments")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (error || !appointment)
    return NextResponse.json(
      { error: "Afspraak niet gevonden." },
      { status: 404 },
    );
  const path = `jobs/${id}/${stage}/${crypto.randomUUID()}.${photoExtension(photo)}`;
  const { error: uploadError } = await db.storage
    .from("request-photos")
    .upload(path, photo, { contentType: photo.type });
  if (uploadError)
    return NextResponse.json(
      { error: "Foto opslaan is mislukt." },
      { status: 503 },
    );
  const { error: saveError } = await db
    .from("request_photos")
    .insert({ appointment_id: id, storage_path: path, stage });
  if (saveError) {
    await db.storage.from("request-photos").remove([path]);
    return NextResponse.json(
      { error: "Foto koppelen is mislukt." },
      { status: 503 },
    );
  }
  revalidatePath(`/admin/appointments/${id}`);
  return NextResponse.json({ ok: true });
}
