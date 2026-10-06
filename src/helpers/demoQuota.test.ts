import { describe, expect, it } from "vitest";
import {
  blockDemoFor,
  demoBlockRemainingMs,
  describeWait,
  readRetryAfterSeconds,
} from "./demoQuota";

// A Storage that keeps values in memory.
function memoryStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, String(value));
    },
  };
}

// A Storage that throws, like a browser with site data blocked.
const brokenStorage = {
  getItem() {
    throw new Error("blocked");
  },
  setItem() {
    throw new Error("blocked");
  },
  removeItem() {
    throw new Error("blocked");
  },
} as unknown as Storage;

const NOW = 1_800_000_000_000;
const DAY_MS = 86_400_000;

const responseWith = (headers: Record<string, string>) =>
  new Response(null, { status: 429, headers });

describe("readRetryAfterSeconds", () => {
  it.each([
    ["60", 60],
    ["86400", 86400],
  ])("T3.1 reads Retry-After: %s", (value, expected) => {
    expect(readRetryAfterSeconds(responseWith({ "Retry-After": value }))).toBe(
      expected,
    );
  });

  it.each([
    ["no header", undefined],
    ["abc", "abc"],
    ["0", "0"],
    ["-5", "-5"],
    // The API only sends seconds, so a date is not used.
    ["an HTTP date", "Wed, 21 Oct 2026 07:28:00 GMT"],
  ])("T3.2 gives null for %s", (_label, value) => {
    const headers: Record<string, string> =
      value === undefined ? {} : { "Retry-After": value };
    expect(readRetryAfterSeconds(responseWith(headers))).toBeNull();
  });
});

describe("blockDemoFor and demoBlockRemainingMs", () => {
  it("T3.3 reports the time left on a block", () => {
    const storage = memoryStorage();
    blockDemoFor(86400, storage, NOW);
    expect(demoBlockRemainingMs(storage, NOW + 1000)).toBe(86_399_000);
  });

  it("T3.4 reports 0 and removes the key once the block has passed", () => {
    const storage = memoryStorage();
    blockDemoFor(86400, storage, NOW);
    expect(demoBlockRemainingMs(storage, NOW + DAY_MS + 1)).toBe(0);
    expect(storage.getItem("demoBlockedUntil")).toBeNull();
  });

  it("T3.5 reports 0 with no entry or an unreadable one", () => {
    expect(demoBlockRemainingMs(memoryStorage(), NOW)).toBe(0);
    expect(
      demoBlockRemainingMs(memoryStorage({ demoBlockedUntil: "abc" }), NOW),
    ).toBe(0);
  });

  it("T3.6 does not throw when storage is unavailable", () => {
    expect(demoBlockRemainingMs(brokenStorage, NOW)).toBe(0);
    expect(() => blockDemoFor(60, brokenStorage, NOW)).not.toThrow();
  });
});

describe("describeWait", () => {
  it.each([
    [1, "in 1 minute"],
    [59_000, "in 1 minute"],
    [60_000, "in 1 minute"],
  ])("T3.7 describeWait(%i) is %s", (ms, expected) => {
    expect(describeWait(ms)).toBe(expected);
  });

  it.each([
    [61_000, "in 2 minutes"],
    [600_000, "in 10 minutes"],
    [3_540_000, "in 59 minutes"],
  ])("T3.8 describeWait(%i) is %s", (ms, expected) => {
    expect(describeWait(ms)).toBe(expected);
  });

  it.each([
    [3_600_000, "in about 1 hour"],
    [3_601_000, "in about 2 hours"], // rounds up
    [82_800_000, "in about 23 hours"],
    [86_400_000, "in about 24 hours"],
  ])("T3.9 describeWait(%i) is %s", (ms, expected) => {
    expect(describeWait(ms)).toBe(expected);
  });
});
