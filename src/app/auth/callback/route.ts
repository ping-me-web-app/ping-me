import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = (searchParams.get("type") as EmailOtpType) || "email";
  const next = searchParams.get("next") ?? "/dashboard";

  // Handle load-balancer / reverse proxy forwarding (e.g. Vercel deployment domain vs custom domain ping-me.nl)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const redirectBase = isLocalEnv
    ? origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : origin;

  // Check if Supabase passed an auth error
  const authError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  if (authError) {
    console.error("Auth error in callback query params:", authError, errorDescription);
    return NextResponse.redirect(
      `${redirectBase}/login?error=auth_failed&details=${encodeURIComponent(errorDescription || authError)}`
    );
  }

  try {
    const supabase = await createClient();

    // 1. Handle token_hash verification (OTP magic link flow)
    if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      if (!error) {
        return NextResponse.redirect(`${redirectBase}${next}`);
      }
      console.warn("Failed verifying token_hash in callback:", error.message);
    }

    // 2. Handle code exchange (PKCE flow)
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${redirectBase}${next}`);
      }
      console.warn("Failed exchanging code for session in callback:", error.message);
    }

    // 3. Fallback: check if the session already exists
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      return NextResponse.redirect(`${redirectBase}${next}`);
    }
  } catch (err) {
    console.error("Unexpected error in auth callback handler:", err);
  }

  // If there is an auth error, redirect to login with an error message
  return NextResponse.redirect(`${redirectBase}/login?error=auth_failed`);
}
