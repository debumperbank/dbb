const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const vm = require("node:vm");
function api({
  uploadError = false,
  rpcError = false,
  authorized = false,
  notifyError = false,
} = {}) {
  const calls = {
    clients: 0,
    uploads: [],
    removed: [],
    rpc: [],
    notifications: [],
  };
  const db = {
    storage: {
      from: () => ({
        upload: async (p) => {
          calls.uploads.push(p);
          return { error: uploadError ? new Error("storage") : null };
        },
        remove: async (p) => {
          calls.removed.push(...p);
          return { error: null };
        },
      }),
    },
    rpc: async (name, args) => {
      calls.rpc.push({ name, args });
      return {
        data: rpcError ? null : "saved-request-id",
        error: rpcError ? new Error("database") : null,
      };
    },
  };
  function load(file) {
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    const module = { exports: {} };
    const requireMock = (name) => {
      if (name === "@/lib/request-notification")
        return {
          notifyNewRequest: async (...args) => {
            calls.notifications.push(args);
            if (notifyError) throw new Error("mail");
            return true;
          },
        };
      if (name === "next/server")
        return {
          NextResponse: { json: (data, init) => Response.json(data, init) },
        };
      if (name === "next/cache") return { revalidatePath: () => {} };
      if (name === "@/lib/supabase/admin")
        return {
          createAdminClient: () => {
            calls.clients++;
            return db;
          },
        };
      if (name === "@/lib/supabase/server")
        return {
          createClient: async () => ({
            auth: {
              getUser: async () => ({
                data: { user: authorized ? { id: "admin" } : null },
                error: null,
              }),
            },
          }),
        };
      return load(
        name.startsWith("@/")
          ? path.resolve(__dirname, "../src", name.slice(2) + ".ts")
          : path.resolve(path.dirname(file), name + ".ts"),
      );
    };
    vm.runInNewContext(code, {
      exports: module.exports,
      module,
      require: requireMock,
      FormData,
      File,
      Request,
      Response,
      Intl,
      Date,
      Object,
      Number,
      Error,
      Uint8Array,
      console: { error: () => {} },
      crypto: globalThis.crypto,
    });
    return module.exports;
  }
  return {
    calls,
    request: load(path.resolve(__dirname, "../src/app/api/requests/route.ts"))
      .POST,
    jobPhoto: load(
      path.resolve(__dirname, "../src/app/api/job-photos/route.ts"),
    ).POST,
  };
}
function form() {
  const f = new FormData();
  for (const [key, value] of Object.entries({
    kind: "appointment",
    consent: "on",
    name: "Test",
    email: "test@example.com",
    phone: "0612345678",
    registration: "AB-12-CD",
    make_model: "Test auto",
    mileage_km: "10000",
    service: "onderhoud",
    location_type: "discuss",
    service_address: "",
    requested_date: "2099-01-01",
    requested_time: "flexible",
    description: "Test aanvraag",
  }))
    f.set(key, value);
  return f;
}
function photo(f) {
  f.append(
    "photos",
    new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], "test.png", {
      type: "image/png",
    }),
  );
}
const request = (f) =>
  new Request("http://localhost/api/requests", { method: "POST", body: f });
test("invalid request never uses privileged database client", async () => {
  const a = api();
  const r = await a.request(request(new FormData()));
  assert.equal(r.status, 400);
  assert.equal(a.calls.clients, 0);
});
test("honeypot never persists data", async () => {
  const a = api();
  const f = form();
  f.set("company", "bot");
  assert.equal((await a.request(request(f))).status, 200);
  assert.equal(a.calls.clients, 0);
});
test("valid request uses one atomic RPC", async () => {
  const a = api();
  const r = await a.request(request(form()));
  assert.equal(r.status, 200);
  assert.equal(a.calls.rpc.length, 1);
  assert.equal(a.calls.rpc[0].name, "submit_mobile_request");
  assert.equal(a.calls.rpc[0].args.payload.kind, "appointment");
});
test("forged image rejected before upload", async () => {
  const a = api();
  const f = form();
  f.append(
    "photos",
    new File(["not a photo"], "photo.jpg", { type: "image/jpeg" }),
  );
  assert.equal((await a.request(request(f))).status, 400);
  assert.equal(a.calls.clients, 0);
});
test("photo failure does not create customer/request", async () => {
  const a = api({ uploadError: true });
  const f = form();
  photo(f);
  assert.equal((await a.request(request(f))).status, 503);
  assert.equal(a.calls.rpc.length, 0);
});
test("database failure removes uploaded photo and exposes no internal errors", async () => {
  const a = api({ rpcError: true });
  const f = form();
  photo(f);
  const r = await a.request(request(f));
  assert.equal(r.status, 503);
  assert.deepEqual(a.calls.removed, a.calls.uploads);
  assert.ok(!(await r.text()).includes("database"));
});
test("photo paths link into atomic request", async () => {
  const a = api();
  const f = form();
  photo(f);
  assert.equal((await a.request(request(f))).status, 200);
  assert.deepEqual(
    Array.from(a.calls.rpc[0].args.photo_paths),
    a.calls.uploads,
  );
});
test("anonymous job photo upload rejected before privileged access", async () => {
  const a = api();
  assert.equal((await a.jobPhoto(request(new FormData()))).status, 401);
  assert.equal(a.calls.clients, 0);
});

test("saved request sends notification with reference and photo count", async () => {
  const a = api();
  const f = form();
  photo(f);
  const r = await a.request(request(f));
  assert.equal(r.status, 200);
  assert.equal(a.calls.notifications.length, 1);
  assert.equal(a.calls.notifications[0][1], "saved-request-id");
  assert.equal(a.calls.notifications[0][2], 1);
});
test("database failure never notifies", async () => {
  const a = api({ rpcError: true });
  await a.request(request(form()));
  assert.equal(a.calls.notifications.length, 0);
});
test("mail failure keeps saved request and photos and returns success", async () => {
  const a = api({ notifyError: true });
  const f = form();
  photo(f);
  const r = await a.request(request(f));
  assert.equal(r.status, 200);
  assert.equal(a.calls.rpc.length, 1);
  assert.equal(a.calls.removed.length, 0);
  assert.equal((await r.json()).ok, true);
});
