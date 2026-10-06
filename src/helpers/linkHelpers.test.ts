import { describe, expect, it } from "vitest";
import { normaliseLink } from "./linkHelpers";

describe("normaliseLink", () => {
  it.each([
    ["T2.1", "linkedin.com/in/me", "https://linkedin.com/in/me"],
    ["T2.2", "https://example.com/a", "https://example.com/a"],
    ["T2.3", "http://example.com", "http://example.com/"],
    ["T2.4", "  https://x.dev/me  ", "https://x.dev/me"],
    ["T2.5", "HTTPS://Example.com/Path", "https://example.com/Path"],
  ])("%s keeps or completes a web address: %j", (_id, input, expected) => {
    expect(normaliseLink(input)).toBe(expected);
  });

  it.each([
    ["T2.6", "javascript:alert(1)"],
    ["T2.7", "file:///C:/Windows/win.ini"],
    ["T2.8", "\\\\attacker.example\\share"],
    ["T2.9", "smb://attacker.example/x"],
    ["T2.10", "ftp://example.com/f"],
    ["T2.11", "mailto:a@b.co"],
    ["T2.12", "data:text/html,hi"],
    // Read as a scheme, so the user must type https://.
    ["T2.13", "example.com:8080/me"],
    ["T2.14a", ""],
    ["T2.14b", "   "],
    ["T2.15", "https://"],
  ])("%s rejects %j", (_id, input) => {
    expect(normaliseLink(input)).toBeNull();
  });

  it("T2.16 rejects a link that is too long once https:// is added", () => {
    const input = `${"a".repeat(95)}.com`;
    expect(input).toHaveLength(99);
    expect(normaliseLink(input)).toBeNull();
  });

  it("T2.17 accepts a link that still fits once https:// is added", () => {
    const input = `${"a".repeat(80)}.com`;
    expect(input).toHaveLength(84);

    const result = normaliseLink(input);
    expect(result).toBe(`https://${input}/`);
    expect(result).toHaveLength(93);
  });
});
