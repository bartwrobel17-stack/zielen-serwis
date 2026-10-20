import { NextResponse } from "next/server";
import { adminCookieName, createAdminToken, passwordMatches } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Panel właściciela nie jest jeszcze skonfigurowany. Dodaj ADMIN_PASSWORD i ADMIN_SESSION_SECRET w ustawieniach środowiska Vercel." }, { status: 503 });
  }
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Nieprawidłowe żądanie." }, { status: 400 }); }
  if (!passwordMatches(body?.password)) {
    return NextResponse.json({ error: "Nieprawidłowe hasło." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName(), createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName(), "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
