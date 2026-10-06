const MAX_LINK_LENGTH = 100; // the API's limit for a link

/** An absolute http(s) URL, adding https:// when there is no scheme; null if not usable. */
export function normaliseLink(raw: string): string | null {
  const value = raw.trim();
  // Backslashes mean a Windows or network-share path, never a web address.
  if (!value || value.includes("\\")) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.href.length <= MAX_LINK_LENGTH ? url.href : null;
  } catch {
    return null;
  }
}
