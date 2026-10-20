// Tell IndexNow search engines (Bing and others) about new or changed URLs.
// Usage:
//   node scripts/indexnow.mjs                 # every URL in https://rinseitoff.com/sitemap.xml
//   node scripts/indexnow.mjs <url> <url> ... # only these URLs
// Run after the site is deployed, so the key file below is live.
const HOST = "rinseitoff.com";
const KEY = "81d56d4fbf953ccb78080351fae6bad3";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const CHUNK = 10000;

async function urlsFromSitemap() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

const args = process.argv.slice(2);
const urlList = args.length ? args : await urlsFromSitemap();
if (!urlList.length) throw new Error("no URLs to submit");

for (let i = 0; i < urlList.length; i += CHUNK) {
  const chunk = urlList.slice(i, i + CHUNK);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: chunk }),
  });
  console.log(`IndexNow: submitted ${chunk.length} URLs, HTTP ${res.status}`);
}
