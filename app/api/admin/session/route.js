import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminToken } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(adminCookieName())?.value;
  const configured = Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
  return NextResponse.json({ authenticated: configured && verifyAdminToken(token), configured });
}
