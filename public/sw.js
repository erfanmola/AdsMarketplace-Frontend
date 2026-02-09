const CACHE = "asset-cache-v1";
const ASSET_REGEX = /\.(tgs|svg|png|jpe?g|webp)(\?.*)?$/i;

self.addEventListener("fetch", (event) => {
	const req = event.request;

	if (
		!req ||
		req.method !== "GET" ||
		!ASSET_REGEX.test(new URL(req.url).pathname)
	) {
		return;
	}

	event.respondWith(handleAssetRequest(req));
});

async function handleAssetRequest(req) {
	try {
		const cache = await caches.open(CACHE);

		// 1) Try cache first
		const cached = await cache.match(req);
		if (cached) return cached;

		// 2) Try network
		const res = await fetch(req, { mode: "no-cors" });

		// 3) Cache only valid or opaque responses
		if (res && (res.ok || res.type === "opaque")) {
			try {
				await cache.put(req, res.clone());
			} catch (cacheErr) {
				// Cache write failed — ignore
				console.warn("[SW] Cache put failed:", cacheErr);
			}
		}

		return res;
	} catch (err) {
		// 4) Absolute fallback: try plain network
		console.warn("[SW] Asset handler failed, fallback:", err);

		try {
			return await fetch(req);
		} catch {
			// 5) Final fallback: return an empty 504 response
			return new Response(null, {
				status: 504,
				statusText: "Gateway Timeout",
			});
		}
	}
}
