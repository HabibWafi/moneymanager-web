import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public paths that don't need auth
  const publicPaths = ["/login", "/auth/callback", "/unauthorized"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (isPublic) return response;

  // Not logged in → redirect to login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return Response.redirect(loginUrl);
  }

  // Check allowed email
  const allowedEmail = process.env.ALLOWED_EMAIL;
  if (allowedEmail && user.email !== allowedEmail) {
    await supabase.auth.signOut();
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    return Response.redirect(unauthorizedUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-.*\\.js).*)",
  ],
};
