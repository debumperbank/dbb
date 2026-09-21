const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const vm = require("node:vm");
const path = require("node:path");
function load(file) {
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, {
    exports: module.exports,
    module,
    require: (name) => load(path.resolve(path.dirname(file), name + ".ts")),
    FormData,
    Intl,
    Date,
    Object,
    Number,
    Error,
  });
  return module.exports;
}
const { validateRequest } = load(
  path.resolve(__dirname, "../src/lib/request-validation.ts"),
);
function valid() {
  const f = new FormData();
  for (const [k, v] of Object.entries({
    kind: "appointment",
    consent: "on",
    name: "Test Klant",
    email: "test@example.com",
    phone: "0612345678",
    registration: "AB-12-CD",
    make_model: "BMW 320i",
    mileage_km: "123000",
    service: "onderhoud",
    location_type: "mobile",
    service_address: "Teststraat 1, 4561 AA Hulst",
    requested_date: "2026-09-22",
    requested_time: "morning",
    description: "Onderhoud",
  }))
    f.set(k, v);
  return f;
}
const check = (f) => validateRequest(f, "2026-09-21");
test("valid request normalizes email and mileage", () => {
  const f = valid();
  f.set("email", " TEST@EXAMPLE.COM ");
  assert.equal(check(f).email, "test@example.com");
  assert.equal(check(f).mileage_km, 123000);
});
for (const key of [
  "consent",
  "name",
  "email",
  "phone",
  "registration",
  "make_model",
  "service",
  "description",
  "requested_date",
])
  test("reject missing " + key, () => {
    const f = valid();
    f.delete(key);
    assert.throws(() => check(f));
  });
for (const date of ["2026-02-30", "2026-09-20", "2026-13-01", "not-a-date"])
  test("reject date " + date, () => {
    const f = valid();
    f.set("requested_date", date);
    assert.throws(() => check(f));
  });
test("mobile work requires location", () => {
  const f = valid();
  f.set("service_address", "");
  assert.throws(() => check(f));
  f.set("location_type", "discuss");
  assert.equal(check(f).service_address, "");
});
test("reject arbitrary service/status payload", () => {
  const f = valid();
  f.set("service", "toString");
  assert.throws(() => check(f));
});
test("reject negative/fractional mileage", () => {
  for (const value of ["-1", "2.5", "Infinity"]) {
    const f = valid();
    f.set("mileage_km", value);
    assert.throws(() => check(f));
  }
});
test("trade in captures condition and price in cents", () => {
  const f = valid();
  f.set("kind", "trade_in");
  f.set("condition", "Gebruikt");
  f.set("maintenance", "Boekje aanwezig");
  f.set("damage", "Geen");
  f.set("asking_price", "1234,56");
  const r = check(f);
  assert.equal(r.asking_price_cents, 123456);
  assert.equal(r.condition, "Gebruikt");
});
test("trade in requires mileage and condition", () => {
  const f = valid();
  f.set("kind", "trade_in");
  assert.throws(() => check(f));
});
test("bounded descriptions", () => {
  const f = valid();
  f.set("description", "x".repeat(2001));
  assert.throws(() => check(f));
});
