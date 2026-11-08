const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const vm = require("node:vm");

function load(file) {
  const source = fs.readFileSync(path.join(__dirname, "../src", file), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, {
    module,
    exports: module.exports,
    require: () => {
      throw new Error("visit.ts must stay free of imports");
    },
    URL,
    JSON,
    Promise,
    decodeURIComponent,
  });
  return module.exports;
}

const visit = load("lib/visit.ts");
const orderId = "550e8400-e29b-41d4-a716-446655440000";

test("public paths stay intact and drop query strings", () => {
  assert.equal(visit.sanitizePath("/"), "/");
  assert.equal(visit.sanitizePath("/contact"), "/contact");
  assert.equal(visit.sanitizePath("/webshop?merk=DRIFT&email=a@b.nl#foto"), "/webshop");
  assert.equal(visit.sanitizePath("/over-ons/"), "/over-ons");
  assert.equal(visit.sanitizePath("https://www.debumperbank.nl/detailing?x=1"), "/detailing");
});

test("id segments on order, stock and admin pages become a placeholder", () => {
  assert.equal(visit.sanitizePath(`/bumpr/bestelling/${orderId}?token=geheim`), `/bumpr/bestelling/:id`);
  assert.equal(visit.sanitizePath(`/occasions/${orderId}`), "/occasions/:id");
  assert.equal(visit.sanitizePath(`/voorraad/${orderId}`), "/voorraad/:id");
  assert.equal(visit.sanitizePath(`/admin/customers/${orderId}`), "/admin/customers/:id");
  assert.equal(visit.sanitizePath(`/admin/werkplaats/${orderId}/intake`), "/admin/werkplaats/:id/intake");
  assert.equal(visit.sanitizePath(`/admin/werkplaats/${orderId}/fotos`), "/admin/werkplaats/:id/fotos");
  assert.equal(visit.sanitizePath("/admin/orders/42/leverbon"), "/admin/orders/:id/leverbon");
  assert.equal(visit.sanitizePath("/account/ord_18af93kx"), "/account/:id");
  assert.equal(visit.sanitizePath(`/account/${"x".repeat(70)}`), "/account/:id");
  assert.equal(visit.sanitizePath(`/admin/werkplaats/${orderId}/planning`), "/admin/werkplaats/:id/planning");
});

test("payload matches the collector contract and omits personal data", () => {
  const bare = visit.visitPayload("/");
  assert.equal(bare.site, "bumperbank");
  assert.equal(bare.path, "/");
  assert.equal("referrer" in bare, false);
  assert.equal(JSON.stringify(bare), '{"site":"bumperbank","path":"/"}');

  const withReferrer = visit.visitPayload(
    `/bumpr/bestelling/${orderId}?token=geheim`,
    `https://www.google.com/search?q=bumperbank&email=a@b.nl#top`,
  );
  assert.equal(JSON.stringify(withReferrer), JSON.stringify({
    site: "bumperbank",
    path: "/bumpr/bestelling/:id",
    referrer: "https://www.google.com/search",
  }));

  const internal = visit.visitPayload(
    "/contact",
    `https://user:secret@www.debumperbank.nl/voorraad/${orderId}?token=geheim#foto`,
  );
  assert.equal(internal.referrer, `https://www.debumperbank.nl/voorraad/:id`);
  assert.equal(visit.visitPayload("/contact", "javascript:alert(1)").referrer, undefined);
  assert.equal(visit.visitPayload("/contact", "").referrer, undefined);
});

test("collection stays in production, on live hosts, and respects DNT and GPC", () => {
  const live = { nodeEnv: "production", hostname: "www.debumperbank.nl" };
  assert.equal(visit.shouldCollectVisit(live), true);
  assert.equal(visit.shouldCollectVisit({ ...live, hostname: "debumperbank.nl" }), true);
  assert.equal(visit.shouldCollectVisit({ ...live, hostname: "dbb-tan.vercel.app" }), true);
  assert.equal(visit.shouldCollectVisit({ ...live, nodeEnv: "development" }), false);
  assert.equal(visit.shouldCollectVisit({ ...live, nodeEnv: "test" }), false);
  assert.equal(visit.shouldCollectVisit({ ...live, hostname: "localhost" }), false);
  assert.equal(visit.shouldCollectVisit({ ...live, hostname: "dbb-tan-git-preview.vercel.app" }), false);
  assert.equal(visit.shouldCollectVisit({ ...live, extraHosts: "localhost", hostname: "localhost" }), true);
  assert.equal(visit.shouldCollectVisit({ ...live, doNotTrack: "1" }), false);
  assert.equal(visit.shouldCollectVisit({ ...live, doNotTrack: "yes" }), false);
  assert.equal(visit.shouldCollectVisit({ ...live, doNotTrack: "0" }), true);
  assert.equal(visit.shouldCollectVisit({ ...live, doNotTrack: null, globalPrivacyControl: true }), false);
});

test("endpoint defaults to the collector and rejects non-http configuration", () => {
  assert.equal(visit.visitCollectUrl(), "https://www.codedbydefault.com/api/collect");
  assert.equal(visit.visitCollectUrl("  "), "https://www.codedbydefault.com/api/collect");
  assert.equal(
    visit.visitCollectUrl("https://collect.example/hook"),
    "https://collect.example/hook",
  );
  assert.equal(visit.visitCollectUrl("javascript:alert(1)"), "https://www.codedbydefault.com/api/collect");
  assert.equal(visit.visitCollectUrl("not a url"), "https://www.codedbydefault.com/api/collect");
});

test("each pathname is counted once until the visitor leaves and returns", () => {
  visit.resetPageViewClaim();
  assert.equal(visit.claimPageView("/"), true);
  assert.equal(visit.claimPageView("/"), false);
  assert.equal(visit.claimPageView("/contact"), true);
  assert.equal(visit.claimPageView("/"), true);
  visit.resetPageViewClaim();
});

test("sendBeacon posts the JSON string and fetch keepalive is only the fallback", async () => {
  const payload = { site: "bumperbank", path: "/contact" };
  const endpoint = "https://www.codedbydefault.com/api/collect";
  let beacon;
  let fetched;
  visit.sendVisit(endpoint, payload, {
    sendBeacon: (url, body) => {
      beacon = { url, body };
      return true;
    },
    fetch: () => {
      fetched = true;
    },
  });
  assert.deepEqual(beacon, { url: endpoint, body: JSON.stringify(payload) });
  assert.equal(typeof beacon.body, "string");
  assert.equal(fetched, undefined);

  let fallback;
  visit.sendVisit(endpoint, payload, {
    sendBeacon: () => false,
    fetch: (url, init) => {
      fallback = { url, init };
    },
  });
  assert.equal(fallback.url, endpoint);
  assert.equal(fallback.init.method, "POST");
  assert.equal(fallback.init.body, JSON.stringify(payload));
  assert.equal(fallback.init.keepalive, true);
  assert.equal(fallback.init.credentials, "omit");
  assert.equal(fallback.init.mode, "cors");

  visit.sendVisit(endpoint, payload, {
    sendBeacon: () => {
      throw new Error("blocked");
    },
    fetch: () => {
      throw new Error("offline");
    },
  });
  await assert.doesNotReject(async () => {
    visit.sendVisit(endpoint, payload, {
      sendBeacon: () => false,
      fetch: () => Promise.reject(new Error("offline")),
    });
  });
});

test("page beacon is wired without cookies, storage or query strings", () => {
  const layout = fs.readFileSync(path.join(__dirname, "../src/app/layout.tsx"), "utf8");
  const beacon = fs.readFileSync(path.join(__dirname, "../src/components/VisitBeacon.tsx"), "utf8");
  const lib = fs.readFileSync(path.join(__dirname, "../src/lib/visit.ts"), "utf8");
  const config = fs.readFileSync(path.join(__dirname, "../next.config.mjs"), "utf8");
  assert.match(layout, /<VisitBeacon\s*\/>/);
  assert.match(beacon, /usePathname\(/);
  assert.match(beacon, /NEXT_PUBLIC_VISIT_COLLECT_URL/);
  assert.match(beacon, /navigator\.sendBeacon/);
  for (const source of [beacon, lib]) {
    assert.doesNotMatch(source, /localStorage|sessionStorage|document\.cookie|indexedDB/);
  }
  assert.match(config, /connect-src 'self' https: wss:/);
  assert.match(config, /https:\/\/www\.codedbydefault\.com/);
});
