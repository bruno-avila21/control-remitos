/* Service worker: precache del app shell para uso offline.
   Estrategia: cache-first para recursos propios (mismo origen).
   Las llamadas a las APIs de IA (Gemini/Anthropic) son de otro origen
   y NO se interceptan: siempre van a la red. */
const CACHE = "remitos-v2";

// Núcleo imprescindible: si algo de acá falla, la instalación falla (queremos saberlo).
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./xlsx.full.min.js",
  "./pdf.min.js",
  "./pdf.worker.min.js",
  "./Logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-180.png",
  "./fonts/public-sans.css",
];

// Best-effort: la fuente. Si un archivo cambia de hash, no rompe la instalación.
const OPTIONAL = [
  "./fonts/ijwRs572Xtc6ZYQws9YVwnNGfJ4.woff2",
  "./fonts/ijwRs572Xtc6ZYQws9YVwnNIfJ7Cww.woff2",
  "./fonts/ijwRs572Xtc6ZYQws9YVwnNJfJ7Cww.woff2",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(CORE);
      await Promise.allSettled(OPTIONAL.map((u) => cache.add(u)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // APIs externas → red directa

  e.respondWith(
    (async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const res = await fetch(req);
        // Cachear en caliente recursos propios que se pidan luego (mismo origen, OK).
        if (res && res.status === 200 && res.type === "basic") {
          const cache = await caches.open(CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch (err) {
        // Sin red y sin caché: si es una navegación, servir el shell.
        if (req.mode === "navigate") {
          const shell = await caches.match("./index.html");
          if (shell) return shell;
        }
        throw err;
      }
    })()
  );
});
