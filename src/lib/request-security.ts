export class RequestRejected extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site")
    throw new RequestRejected(403, "Aanvraag vanaf een andere website geweigerd.");
  if (origin) {
    // Next.js may reconstruct request.url with localhost behind a reverse proxy.
    // Host is the actual HTTP destination; do not trust arbitrary forwarded hosts.
    const destination = request.headers.get("host") || new URL(request.url).host;
    let allowed = false;
    try {
      const source = new URL(origin);
      allowed = ["https:", "http:"].includes(source.protocol) && source.host === destination && !source.username && !source.password;
    } catch { /* Invalid/null origins are rejected. */ }
    if (!allowed) throw new RequestRejected(403, "Aanvraag vanaf een andere website geweigerd.");
  }
}
export async function boundedRequest(request: Request, limit: number): Promise<Request> {
  if (Number(request.headers.get("content-length") || 0) > limit)
    throw new RequestRejected(413, "De aanvraag is te groot.");
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > limit) {
          await reader.cancel();
          throw new RequestRejected(413, "De aanvraag is te groot.");
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new Request(request.url, { method: request.method, headers: request.headers, body });
}
export async function secureRequest(request: Request, limit: number, sameOrigin = true) {
  try {
    if (sameOrigin) requireSameOrigin(request);
    return { request: await boundedRequest(request, limit), error: null };
  } catch (error) {
    return { request: null, error: Response.json(
      { error: error instanceof RequestRejected ? error.message : "Ongeldige aanvraag." },
      { status: error instanceof RequestRejected ? error.status : 400 },
    ) };
  }
}
