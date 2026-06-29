// Cloudflare Worker — Web Push server
// Endpoints:
//   POST   /api/subscribe           { endpoint, keys: {p256dh, auth} }  -> save to KV
//   DELETE /api/subscribe           { endpoint }                        -> remove from KV
//   GET    /api/vapid-public-key                                       -> Base64URL VAPID public key
//   POST   /api/trigger-push        { title?, body?, tag?, data? }      -> fan-out push (X-Admin-Token)
//
// Required bindings / secrets (configured in wrangler.toml / dashboard):
//   - KV namespace: SUBSCRIPTIONS (binding)
//   - Secret env:   VAPID_PRIVATE_JWK    (JWK JSON of the VAPID ECDSA P-256 private key)
//   - Secret env:   VAPID_PUBLIC_KEY     (Base64URL, uncompressed P-256 public key)
//   - Secret env:   VAPID_SUBJECT        (mailto:you@example.com or https://example.com)
//   - Secret env:   ADMIN_TOKEN          (shared secret for /api/trigger-push)
//
// KV layout:
//   key   = the subscription endpoint URL
//   value = JSON { endpoint, keys: {p256dh, auth}, createdAt }
//
// Self-test / dev usage (Node 22+):
//   node /tmp/push-server.js            -> prints a generated VAPID JWK pair and exits
//   Worker mode: deployed to Cloudflare.

// In-memory fallback when no KV binding configured (dev)
const __memKV = {
  data: new Map(),
  async get(k) { return this.data.get(k) || null; },
  async put(k, v) { this.data.set(k, v); },
  async delete(k) { this.data.delete(k); },
  async list() { return { keys: [...this.data.keys()].map(name => ({ name })) }; }
};

export default {
  async scheduled(event, env, ctx) {
    // Cron trigger: scan subscribers and send a daily digest
    ctx.waitUntil(scheduledDigest(env));
  },

  async fetch(request, env, ctx) {
    return handle(request, env, ctx);
  },
};

// ---------------------------------------------------------------------------
// Base64URL helpers
// ---------------------------------------------------------------------------

function b64urlToBytes(s) {
  s = String(s).replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function jsonResponse(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

// ---------------------------------------------------------------------------
// HKDF (HMAC-SHA256) — needed for RFC 8291 Web Push payload encryption
// ---------------------------------------------------------------------------

async function hmacSha256(keyBytes, dataBytes) {
  const k = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", k, dataBytes);
  return new Uint8Array(sig);
}

async function hkdfExtract(salt, ikm) {
  // PRK = HMAC-SHA256(salt, ikm)
  return hmacSha256(salt, ikm);
}

async function hkdfExpand(prk, info, length) {
  const hashLen = 32;
  const n = Math.ceil(length / hashLen);
  const out = new Uint8Array(n * hashLen);
  let prev = new Uint8Array(0);
  for (let i = 0; i < n; i++) {
    const input = new Uint8Array(prev.length + info.length + 1);
    input.set(prev, 0);
    input.set(info, prev.length);
    input[prev.length + info.length] = i + 1;
    prev = await hmacSha256(prk, input);
    out.set(prev, i * hashLen);
  }
  return out.slice(0, length);
}

// ---------------------------------------------------------------------------
// VAPID JWT (ES256, RFC 8292)
// ---------------------------------------------------------------------------

async function buildVapidHeaders(audience, subject, vapidPrivateJwk, vapidPublicB64Url) {
  const header = bytesToB64url(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const now = Math.floor(Date.now() / 1000);
  const claims = bytesToB64url(
    new TextEncoder().encode(
      JSON.stringify({ aud: audience, exp: now + 12 * 3600, sub: subject }),
    ),
  );
  const signingInput = `${header}.${claims}`;

  const key = await crypto.subtle.importKey(
    "jwk",
    vapidPrivateJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );

  let sig = new Uint8Array(
    await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      new TextEncoder().encode(signingInput),
    ),
  );

  // Cloudflare Workers returns IEEE P1363 (raw r||s, 64 bytes). Node's Web Crypto
  // historically returned ASN.1 DER. Detect and normalize to 64-byte JWS form.
  if (sig.length !== 64) {
    sig = derToJws(sig);
  }

  const jwt = `${signingInput}.${bytesToB64url(sig)}`;

  return {
    Authorization: `vapid t=${jwt}, k=${vapidPublicB64Url}`,
  };
}

function derToJws(der) {
  // SEQUENCE { INTEGER r, INTEGER s }
  let i = 2;
  if (der[1] & 0x80) i += der[1] & 0x7f;
  // INTEGER r
  if (der[i] !== 0x02) throw new Error("bad DER: expected INTEGER r");
  let rLen = der[i + 1];
  let rOff = i + 2;
  if (rLen === 33 && der[rOff] === 0) {
    rOff++;
    rLen = 32;
  }
  i = rOff + rLen;
  // INTEGER s
  if (der[i] !== 0x02) throw new Error("bad DER: expected INTEGER s");
  let sLen = der[i + 1];
  let sOff = i + 2;
  if (sLen === 33 && der[sOff] === 0) {
    sOff++;
    sLen = 32;
  }
  const out = new Uint8Array(64);
  out.set(der.slice(rOff, rOff + rLen), 0);
  out.set(der.slice(sOff, sOff + sLen), 32);
  return out;
}

// ---------------------------------------------------------------------------
// Web Push payload encryption (RFC 8291 / draft-ietf-webpush-encryption-04)
// ---------------------------------------------------------------------------

async function encryptPushPayload(subscriberP256dh, subscriberAuth, payload) {
  const uaPublic = b64urlToBytes(subscriberP256dh); // 65 bytes uncompressed
  if (uaPublic.length !== 65 || uaPublic[0] !== 0x04) {
    throw new Error("subscriber p256dh must be 65-byte uncompressed point");
  }
  const authSecret = b64urlToBytes(subscriberAuth);
  if (authSecret.length < 16) {
    // Browsers send 16 bytes, but pad if shorter.
  }

  // 1. Generate ephemeral ECDH P-256 key pair.
  const localPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
  const localPublicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", localPair.publicKey));
  // "raw" export is 65 bytes (0x04 || X || Y); keep as-is.
  const asPublic = localPublicRaw;

  // 2. ECDH shared secret.
  const subscriberKey = await crypto.subtle.importKey(
    "raw",
    uaPublic.slice(1), // strip 0x04 prefix for import
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );
  const sharedBits = await crypto.subtle.deriveBits(
    { name: "ECDH", public: subscriberKey },
    localPair.privateKey,
    256,
  );
  const ecdhSecret = new Uint8Array(sharedBits);

  // 3. HKDF.
  const prk = await hkdfExtract(authSecret, ecdhSecret);
  const keyInfo = new Uint8Array(12 + uaPublic.length + asPublic.length);
  keyInfo.set(new TextEncoder().encode("WebPush: info\x00"), 0);
  keyInfo.set(uaPublic, 12);
  keyInfo.set(asPublic, 12 + uaPublic.length);
  const keying = await hkdfExpand(prk, keyInfo, 32);
  const aesKey = keying.slice(16, 32); // 16 bytes
  const salt = keying.slice(0, 16);    // 16 bytes (used as AES-GCM nonce here)

  // 4. Plaintext = 0x02 || payload  (no padding — minimum-valid encoding).
  const plaintext = new Uint8Array(1 + payload.length);
  plaintext[0] = 0x02;
  plaintext.set(payload, 1);

  // 5. AES-128-GCM.
  const aesCryptoKey = await crypto.subtle.importKey(
    "raw",
    aesKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  // Browsers accept the 16-byte salt directly as the GCM nonce.
  const ciphertextWithTag = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: salt, tagLength: 128 },
      aesCryptoKey,
      plaintext,
    ),
  );

  // 6. AESGCM header on the wire:
  //    salt(16) || rs(4, BE = 4096) || idlen(1) || keyid(idlen)
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096, false);
  const idlen = new Uint8Array([asPublic.length]);
  const header = new Uint8Array(16 + 4 + 1 + asPublic.length);
  header.set(salt, 0);
  header.set(rs, 16);
  header.set(idlen, 20);
  header.set(asPublic, 21);

  const body = new Uint8Array(header.length + ciphertextWithTag.length);
  body.set(header, 0);
  body.set(ciphertextWithTag, header.length);
  return body;
}

// ---------------------------------------------------------------------------
// Push transport: POST encrypted payload to subscriber endpoint with VAPID auth
// ---------------------------------------------------------------------------

async function deliverToSubscriber(env, sub, payloadBytes) {
  const endpoint = new URL(sub.endpoint);
  const audience = `${endpoint.protocol}//${endpoint.host}`;

  let privateJwk;
  try {
    privateJwk = JSON.parse(env.VAPID_PRIVATE_JWK);
  } catch (e) {
    throw new Error("VAPID_PRIVATE_JWK is not valid JSON");
  }

  const vapidHeaders = await buildVapidHeaders(
    audience,
    env.VAPID_SUBJECT || "mailto:admin@example.com",
    privateJwk,
    env.VAPID_PUBLIC_KEY,
  );

  // The TTL is a hint to the push service. 86400 = 24h.
  const headers = {
    ...vapidHeaders,
    "Content-Type": "application/octet-stream",
    "Content-Encoding": "aesgcm",
    TTL: "86400",
  };

  const resp = await fetch(sub.endpoint, {
    method: "POST",
    headers,
    body: payloadBytes,
  });

  if (resp.status === 201 || resp.status === 200) {
    return { ok: true, status: resp.status };
  }

  // 404 / 410 — subscription is gone, delete it.
  if (resp.status === 404 || resp.status === 410) {
    await (env.SUBSCRIPTIONS || __memKV).delete(sub.endpoint);
    return { ok: false, status: resp.status, removed: true };
  }

  let text = "";
  try {
    text = await resp.text();
  } catch (_) {
    // ignore
  }
  return { ok: false, status: resp.status, body: text.slice(0, 500) };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

async function handle(request, env, ctx) {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method.toUpperCase();

  // CORS preflight.
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  try {
    if (pathname === "/api/subscribe" && method === "POST") {
      return await routeSubscribe(request, env);
    }
    if (pathname === "/api/subscribe" && method === "DELETE") {
      return await routeUnsubscribe(request, env);
    }
    if (pathname === "/api/vapid-public-key" && method === "GET") {
      return await routeVapidPublicKey(env);
    }
    if (pathname === "/api/trigger-push" && method === "POST") {
      return await routeTriggerPush(request, env, ctx);
    }
    return jsonResponse({ error: "not found" }, 404);
  } catch (err) {
    return jsonResponse({ error: String(err && err.message ? err.message : err) }, 500);
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    "Access-Control-Max-Age": "86400",
  };
}

async function routeSubscribe(request, env) {
  const body = await safeJson(request);
  if (!body || !body.endpoint || !body.keys || !body.keys.p256dh || !body.keys.auth) {
    return jsonResponse(
      { error: "invalid body: require { endpoint, keys: { p256dh, auth } }" },
      400,
      corsHeaders(),
    );
  }
  const record = {
    endpoint: String(body.endpoint),
    keys: {
      p256dh: String(body.keys.p256dh),
      auth: String(body.keys.auth),
    },
    createdAt: new Date().toISOString(),
  };
  await (env.SUBSCRIPTIONS || __memKV).put(record.endpoint, JSON.stringify(record));
  return jsonResponse({ ok: true }, 201, corsHeaders());
}

async function routeUnsubscribe(request, env) {
  const body = await safeJson(request);
  if (!body || !body.endpoint) {
    return jsonResponse({ error: "invalid body: require { endpoint }" }, 400, corsHeaders());
  }
  await (env.SUBSCRIPTIONS || __memKV).delete(String(body.endpoint));
  return jsonResponse({ ok: true }, 200, corsHeaders());
}

async function routeVapidPublicKey(env) {
  if (!env.VAPID_PUBLIC_KEY) {
    return jsonResponse({ error: "VAPID public key not configured" }, 500, corsHeaders());
  }
  return jsonResponse({ key: env.VAPID_PUBLIC_KEY }, 200, corsHeaders());
}

async function routeTriggerPush(request, env, ctx) {
  const token = request.headers.get("X-Admin-Token");
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return jsonResponse({ error: "unauthorized" }, 401, corsHeaders());
  }
  if (!env.VAPID_PRIVATE_JWK || !env.VAPID_PUBLIC_KEY) {
    return jsonResponse({ error: "VAPID keys not configured" }, 500, corsHeaders());
  }

  const body = (await safeJson(request)) || {};
  const notification = {
    title: body.title || "",
    body: body.body || "",
    tag: body.tag || undefined,
    data: body.data || undefined,
  };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(notification));

  // List subscriptions. KV list returns up to 1000 per call; paginate.
  const subs = [];
  let cursor;
  do {
    const page = await (env.SUBSCRIPTIONS || __memKV).list({ cursor });
    for (const k of page.keys) {
      const raw = await (env.SUBSCRIPTIONS || __memKV).get(k.name);
      if (!raw) continue;
      try {
        subs.push(JSON.parse(raw));
      } catch (_) {
        // skip malformed
      }
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  const results = await Promise.all(
    subs.map(async (sub) => {
      try {
        const encrypted = await encryptPushPayload(sub.keys.p256dh, sub.keys.auth, payloadBytes);
        return await deliverToSubscriber(env, sub, encrypted);
      } catch (err) {
        return { ok: false, endpoint: sub.endpoint, error: String(err && err.message ? err.message : err) };
      }
    }),
  );

  const summary = {
    ok: results.filter((r) => r.ok).length,
    failed: results.length - results.filter((r) => r.ok).length,
    total: results.length,
    results,
  };
  return jsonResponse(summary, 200, corsHeaders());
}

async function safeJson(request) {
  try {
    return await request.json();
  } catch (_) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Local helper: when run directly under Node 22+, generate a fresh VAPID keypair
// and print it. Useful for seeding wrangler.toml / `wrangler secret put`.
//   node /tmp/push-server.js
// ---------------------------------------------------------------------------

if (typeof process !== "undefined" && process.versions && process.versions.node) {
  // Only run when executed as a script (not when imported).
  // The `default export` block above is harmless under Node; we just exit after
  // printing the keypair so wrangler can be configured.
  const isMain =
    typeof require !== "undefined" && require.main === module
      ? true
      : // ESM entrypoint detection
        (typeof process !== "undefined" &&
          process.argv[1] &&
          /push-server\.js$/.test(process.argv[1]));
  if (isMain) {
    (async () => {
      const pair = await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign", "verify"],
      );
      const pubJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
      const privJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
      const pubRaw = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
      const pubB64Url = bytesToB64url(pubRaw);
      console.log("VAPID_PUBLIC_KEY (base64url, set as env secret):");
      console.log(pubB64Url);
      console.log("\nVAPID_PRIVATE_JWK (set as env secret):");
      console.log(JSON.stringify(privJwk));
      console.log("\nVAPID_SUBJECT (mailto: or https:):");
      console.log("mailto:admin@example.com");
      console.log("\nPublic JWK (for reference):");
      console.log(JSON.stringify(pubJwk));
    })();
  }
}


async function scheduledDigest(env) {
  // Stub: no real RSS feed source yet, just log
  console.log('[xjb-push] scheduled digest at', new Date().toISOString());
  // TODO: fetch 公众号 RSS, build digest, call sendPushToAll()
  // (Skipped because Sogou anti-bot blocks scraping; pending alternative source)
}
