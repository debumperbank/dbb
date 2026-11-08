"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  browserPrivacySignals,
  claimPageView,
  sendVisit,
  shouldCollectVisit,
  visitCollectUrl,
  visitPayload,
} from "@/lib/visit";

export function VisitBeacon() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    try {
      const privacy = browserPrivacySignals();
      if (
        !shouldCollectVisit({
          nodeEnv: process.env.NODE_ENV,
          hostname: window.location.hostname,
          extraHosts: process.env.NEXT_PUBLIC_VISIT_HOSTS,
          doNotTrack: privacy.doNotTrack,
          globalPrivacyControl: privacy.globalPrivacyControl,
        })
      ) {
        return;
      }
      if (!claimPageView(pathname)) return;
      const referrer = typeof document === "undefined" ? "" : document.referrer;
      sendVisit(visitCollectUrl(process.env.NEXT_PUBLIC_VISIT_COLLECT_URL), visitPayload(pathname, referrer), {
        sendBeacon: (url, body) =>
          typeof navigator.sendBeacon === "function" ? navigator.sendBeacon(url, body) : false,
        fetch: (url, init) => fetch(url, init),
      });
    } catch {
      // A failed count must never surface in the page.
    }
  }, [pathname]);

  return null;
}
