const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const vm = require("node:vm");
function setup({ failure, configured = true, from } = {}) {
  const sent = [],
    errors = [];
  const env = configured
    ? { RESEND_API_KEY: "test-key", NOTIFY_EMAIL: "owner@example.com" }
    : {};
  if (from) env.NOTIFY_FROM_EMAIL = from;
  function load(file) {
    const module = { exports: {} };
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    vm.runInNewContext(code, {
      exports: module.exports,
      module,
      process: { env },
      Intl,
      console: {
        error: (...a) => errors.push(a),
        warn: (...a) => errors.push(a),
      },
      require: (name) =>
        name === "resend"
          ? {
              Resend: class {
                emails = {
                  send: async (message, options) => {
                    sent.push({ message, options });
                    if (failure === "throw") throw new Error("network");
                    return {
                      error:
                        failure === "returned"
                          ? { name: "validation_error" }
                          : null,
                    };
                  },
                };
              },
            }
          : load(path.resolve(path.dirname(file), name + ".ts")),
    });
    return module.exports;
  }
  return {
    ...load(path.resolve(__dirname, "../src/lib/request-notification.ts")),
    sent,
    errors,
  };
}
const appointment = {
  kind: "appointment",
  name: "Klant",
  email: "customer@example.com",
  phone: "0612345678",
  registration: "AB-12-CD",
  mileage_km: 123,
  make_model: "BMW",
  service: "onderhoud",
  location_type: "mobile",
  service_address: "Testlocatie",
  requested_date: "2026-10-01",
  requested_time: "morning",
  description: "Onderhoud nodig",
};
test("appointment email uses configured recipient, reply-to, private dashboard link and idempotency", async () => {
  const a = setup({ from: "Garage <garage@example.com>" });
  assert.equal(await a.notifyNewRequest(appointment, "id-123", 2), true);
  const { message, options } = a.sent[0];
  assert.equal(message.to, "owner@example.com");
  assert.equal(message.from, "Garage <garage@example.com>");
  assert.equal(message.replyTo, appointment.email);
  assert.match(message.subject, /afspraakaanvraag/);
  assert.match(message.text, /Ochtend/);
  assert.match(message.text, /Foto’s: 2/);
  assert.match(message.text, /\/admin\/appointments\/id-123/);
  assert.equal(options.idempotencyKey, "request-notification/id-123");
  assert.equal(message.attachments, undefined);
});
test("trade in email contains price, condition and damage", async () => {
  const a = setup();
  const payload = {
    kind: "trade_in",
    name: "Klant",
    email: "customer@example.com",
    phone: "0612345678",
    registration: "AB-12-CD",
    mileage_km: 123,
    condition: "Goed",
    maintenance: "Boekje",
    damage: "Kras",
    asking_price_cents: 123456,
  };
  await a.notifyNewRequest(payload, "id-456", 0);
  const { message } = a.sent[0];
  assert.match(message.subject, /inkoopaanvraag/);
  for (const value of [
    "Goed",
    "Boekje",
    "Kras",
    "1.234,56",
    "/admin/trade-ins",
  ])
    assert.ok(message.text.includes(value));
  assert.ok(!message.text.includes("undefined"));
});
for (const failure of ["returned", "throw"])
  test("provider " + failure + " failure is contained", async () => {
    const a = setup({ failure });
    assert.equal(await a.notifyNewRequest(appointment, "id", 0), false);
    assert.equal(a.errors.length, 1);
  });
test("missing configuration does not attempt delivery", async () => {
  const a = setup({ configured: false });
  assert.equal(await a.notifyNewRequest(appointment, "id", 0), false);
  assert.equal(a.sent.length, 0);
});
