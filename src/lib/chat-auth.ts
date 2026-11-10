import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const CHAT_COOKIE = "cc_s";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const secret = () => process.env.CHAT_SECRET || "";
export const allowedPhones = () =>
  (process.env.CHAT_ALLOWED_PHONES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
export const ownerPhone = () => (process.env.CHAT_OWNER_PHONE || "").trim();

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function makeToken(phone: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${phone}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): string | null {
  if (!token || !secret()) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [phone, exp, sig] = parts;
  const expected = sign(`${phone}.${exp}`);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return null;
  if (!allowedPhones().includes(phone)) return null;
  return phone;
}

export async function currentUser(): Promise<string | null> {
  const jar = await cookies();
  return verifyToken(jar.get(CHAT_COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
