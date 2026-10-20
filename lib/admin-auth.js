import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "ziel_serwis_admin";
const SESSION_TTL = 1000 * 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function signature(value) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function adminCookieName() {
  return COOKIE_NAME;
}

export function createAdminToken() {
  if (!secret() || !process.env.ADMIN_PASSWORD) throw new Error("Admin authentication is not configured");
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL, role: "owner" })).toString("base64url");
  return payload + "." + signature(payload);
}

export function verifyAdminToken(token) {
  if (!token || !secret() || !process.env.ADMIN_PASSWORD) return false;
  const [payload, supplied, extra] = token.split(".");
  if (!payload || !supplied || extra) return false;
  const expected = signature(payload);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.role === "owner" && Number.isFinite(data.exp) && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function passwordMatches(candidate) {
  const configured = process.env.ADMIN_PASSWORD || "";
  if (!configured || typeof candidate !== "string") return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}
