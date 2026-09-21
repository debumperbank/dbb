import Image from "next/image";
import { crmClient } from "@/lib/crm";
export async function RequestPhotos({
  id,
  kind,
}: {
  id: string;
  kind: "appointment" | "trade_in";
}) {
  const db = await crmClient();
  const { data, error } = await db
    .from("request_photos")
    .select("id,storage_path,stage")
    .eq(kind === "appointment" ? "appointment_id" : "trade_in_id", id)
    .order("created_at");
  if (error) return <p role="alert">Foto’s konden niet worden geladen.</p>;
  if (!data?.length)
    return <p className="text-muted">Geen foto’s toegevoegd.</p>;
  const photos = await Promise.all(
    data.map(async (p) => {
      const { data: signed } = await db.storage
        .from("request-photos")
        .createSignedUrl(String(p.storage_path), 600);
      return {
        id: String(p.id),
        stage: String(p.stage),
        url: signed?.signedUrl,
      };
    }),
  );
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {photos.map((p) =>
        p.url ? (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <Image
              unoptimized
              width={400}
              height={400}
              src={p.url}
              alt="Foto bij de aanvraag"
              className="w-full aspect-square object-cover rounded"
            />
            <span className="text-xs text-muted">
              {{
                request: "Aanvraag",
                before: "Voor",
                during: "Tijdens",
                after: "Na",
              }[p.stage] || p.stage}
            </span>
          </a>
        ) : (
          <p key={p.id}>Foto niet beschikbaar.</p>
        ),
      )}
    </div>
  );
}
