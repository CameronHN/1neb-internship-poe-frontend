import { describe, expect, it } from "vitest";
import { readApiError } from "./apiError";

const FALLBACK = "FALLBACK";

const read = (body: string | null, status = 400) =>
  readApiError(new Response(body, { status }), FALLBACK);

describe("readApiError", () => {
  it("T1.1 reads { error: { message } }", async () => {
    const message = "You can save up to 50 resumes. Delete one to save another.";
    expect(
      await read(JSON.stringify({ error: { message, statusCode: 422 } }), 422),
    ).toBe(message);
  });

  it("T1.2 reads a validation error with one field message", async () => {
    expect(
      await read(
        JSON.stringify({
          title: "One or more validation errors occurred.",
          status: 400,
          errors: { Summary: ["Max. character limit reached."] },
        }),
      ),
    ).toBe("Max. character limit reached.");
  });

  it("T1.3 joins the messages of several fields", async () => {
    expect(
      await read(
        JSON.stringify({
          title: "One or more validation errors occurred.",
          status: 400,
          errors: {
            FirstName: ["The FirstName field is required."],
            ConfirmPassword: ["'ConfirmPassword' and 'Password' do not match."],
          },
        }),
      ),
    ).toBe(
      "The FirstName field is required. 'ConfirmPassword' and 'Password' do not match.",
    );
  });

  it("T1.4 reads an Identity error keyed by an empty string", async () => {
    expect(
      await read(
        JSON.stringify({
          "": ["Registration could not be completed with these details."],
        }),
      ),
    ).toBe("Registration could not be completed with these details.");
  });

  it("T1.5 uses the title of a problem-details body, not the type URL or trace id", async () => {
    expect(
      await read(
        JSON.stringify({
          type: "https://tools.ietf.org/html/rfc9110#section-15.5.16",
          title: "Unsupported Media Type",
          status: 415,
          traceId: "00-abc",
        }),
        415,
      ),
    ).toBe("Unsupported Media Type");
  });

  it("T1.6 reads a plain-text answer", async () => {
    expect(await read("Invalid login attempt")).toBe("Invalid login attempt");
  });

  it("T1.7 reads a JSON string", async () => {
    expect(await read(JSON.stringify("Invalid login attempt"))).toBe(
      "Invalid login attempt",
    );
  });

  it("T1.8 reads a legacy { message }", async () => {
    expect(await read(JSON.stringify({ message: "legacy" }))).toBe("legacy");
  });

  it("T1.9 falls back on an empty body", async () => {
    expect(await read(null, 500)).toBe(FALLBACK);
  });

  it("T1.10 falls back on a long HTML page, such as a proxy error", async () => {
    const html = `<html><body>${"Bad gateway. ".repeat(30)}</body></html>`;
    expect(html.length).toBeGreaterThan(300);
    expect(await read(html, 502)).toBe(FALLBACK);
  });
});
