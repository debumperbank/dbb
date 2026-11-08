export const VISIT_SITE = "bumperbank" as const;

export const DEFAULT_VISIT_COLLECT_URL = "https://www.codedbydefault.com/api/collect";

export const DEFAULT_VISIT_HOSTS = [
  "www.debumperbank.nl",
  "debumperbank.nl",
  "dbb-tan.vercel.app",
] as const;

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type VisitPayload = {
  site: typeof VISIT_SITE;
  path: string;
  referrer?: string;
};

export type VisitRequest = {
  method: "POST";
  body: string;
  keepalive: true;
  credentials: "omit";
  mode: "cors";
};

export type VisitTransport = {
  sendBeacon?: (url: string, body: string) => boolean;
  fetch?: (url: string, init: VisitRequest) => unknown;
};

export type VisitGate = {
  nodeEnv: string | undefined;
  hostname: string;
  extraHosts?: string;
  doNotTrack?: string | null;
  globalPrivacyControl?: boolean;
};

let lastClaimedPath: string | null = null;

export function resetPageViewClaim(): void {
  lastClaimedPath = null;
}

/** One count per visit to this pathname, including a later return to it. */
export function claimPageView(pathname: string): boolean {
  if (lastClaimedPath === pathname) return false;
  lastClaimedPath = pathname;
  return true;
}

export function allowedVisitHosts(extra = ""): string[] {
  const hosts = new Set<string>(DEFAULT_VISIT_HOSTS);
  for (const part of extra.split(",")) {
    const host = part.trim().toLowerCase();
    if (host) hosts.add(host);
  }
  return [...hosts];
}

export function shouldCollectVisit(gate: VisitGate): boolean {
  if (gate.nodeEnv !== "production") return false;
  const hostname = gate.hostname.trim().toLowerCase();
  if (!hostname || !allowedVisitHosts(gate.extraHosts).includes(hostname)) return false;
  const dnt = gate.doNotTrack;
  if (dnt === "1" || dnt === "yes") return false;
  if (gate.globalPrivacyControl === true) return false;
  return true;
}

export function browserPrivacySignals(): {
  doNotTrack: string | null;
  globalPrivacyControl: boolean;
} {
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  const legacyWindow = window as Window & { doNotTrack?: string };
  const candidates = [nav.doNotTrack, legacyWindow.doNotTrack, nav.msDoNotTrack];
  const found = candidates.find((value) => value != null && value !== "unspecified");
  return {
    doNotTrack: found == null ? null : String(found),
    globalPrivacyControl: nav.globalPrivacyControl === true,
  };
}

export function visitCollectUrl(configured?: string): string {
  const value = configured?.trim();
  if (!value) return DEFAULT_VISIT_COLLECT_URL;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return DEFAULT_VISIT_COLLECT_URL;
    return url.toString();
  } catch {
    return DEFAULT_VISIT_COLLECT_URL;
  }
}

function maskSegment(segment: string): string {
  if (!segment) return segment;
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    decoded = segment;
  }
  if (!decoded || decoded.includes("@") || decoded.length > 64) return ":id";
  if (UUID.test(decoded) || /^\d+$/.test(decoded)) return ":id";
  if (/^[0-9a-f]{16,}$/i.test(decoded)) return ":id";
  if (/^[A-Za-z0-9_-]{21,}$/.test(decoded)) return ":id";
  if (
    decoded.length >= 8 &&
    /[A-Za-z]/.test(decoded) &&
    /\d/.test(decoded) &&
    /^[A-Za-z0-9_-]+$/.test(decoded)
  ) {
    return ":id";
  }
  return decoded;
}

export function sanitizePath(input: string): string {
  let path = input.split("#", 1)[0]?.split("?", 1)[0]?.trim() ?? "";
  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "/";
    }
  }
  if (!path.startsWith("/")) path = `/${path}`;
  const cleaned = path.split("/").map((segment, index) => (index === 0 ? segment : maskSegment(segment))).join("/");
  if (cleaned.length > 1 && cleaned.endsWith("/")) return cleaned.slice(0, -1) || "/";
  return cleaned || "/";
}

export function sanitizeReferrer(referrer: string): string | undefined {
  const value = referrer.trim();
  if (!value) return undefined;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
  url.username = "";
  url.password = "";
  url.search = "";
  url.hash = "";
  const path = sanitizePath(url.pathname);
  const result = `${url.origin}${path}`;
  if (result.length > 500) return undefined;
  return result;
}

export function visitPayload(pathname: string, referrer = ""): VisitPayload {
  const payload: VisitPayload = { site: VISIT_SITE, path: sanitizePath(pathname) };
  const cleanReferrer = sanitizeReferrer(referrer);
  if (cleanReferrer) payload.referrer = cleanReferrer;
  return payload;
}

export function sendVisit(endpoint: string, payload: VisitPayload, transport: VisitTransport): void {
  let body: string;
  try {
    body = JSON.stringify(payload);
  } catch {
    return;
  }
  try {
    if (transport.sendBeacon?.(endpoint, body) === true) return;
  } catch {
    // fetch is the fallback
  }
  try {
    const pending = transport.fetch?.(endpoint, {
      method: "POST",
      body,
      keepalive: true,
      credentials: "omit",
      mode: "cors",
    });
    void Promise.resolve(pending).catch(() => {});
  } catch {
    // A failed count must never surface in the page.
  }
}
