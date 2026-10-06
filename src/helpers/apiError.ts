/** The most useful message from a failed API response, or the fallback. */
export async function readApiError(response: Response, fallback: string): Promise<string> {
  const text = await response.text().catch(() => "");
  if (!text) return fallback;

  try {
    const body = JSON.parse(text);

    // A JSON string, e.g. "Invalid login attempt" when JSON was requested.
    if (typeof body === "string" && body) return body;

    // { error: { message, statusCode } }
    if (typeof body?.error?.message === "string") return body.error.message;

    // { errors: { Field: [...] } } or { "": [...] }
    const fields = body?.errors ?? body;
    if (fields && typeof fields === "object") {
      const messages = Object.values(fields)
        .filter(Array.isArray)
        .flat()
        .filter((m): m is string => typeof m === "string");
      if (messages.length > 0) return messages.join(" ");
    }

    if (typeof body?.message === "string") return body.message;
    if (typeof body?.title === "string") return body.title;
  } catch {
    // Not JSON: plain-text answers such as "Invalid login attempt".
    if (text.length <= 200) return text;
  }

  return fallback;
}
