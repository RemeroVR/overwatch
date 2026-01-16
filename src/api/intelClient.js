export async function getIntel(countryObj, intelSource) {
  const url = `https://overwatch-intel.YOUR_SUBDOMAIN.workers.dev/intel?country=${countryObj.code}&intelSource=${intelSource}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Intel API failed", res.status);
    return [];
  }
  return await res.json();
}
