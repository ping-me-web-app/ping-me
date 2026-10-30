import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured in this environment." },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed or pending", status: session.payment_status },
        { status: 400 }
      );
    }

    const meta = session.metadata || {};
    const orderId = meta.orderId || `PM-NL-${session.id.slice(-6).toUpperCase()}`;
    const token = meta.token || `PM-NL-${session.id.slice(-4).toUpperCase()}`;

    const vehicleData = {
      plate: meta.plate || "XX-00-XX",
      make: meta.make || "Volkswagen",
      model: meta.model || "Golf",
      color: meta.color || "Black",
      token,
      channel: meta.channel || "whatsapp",
      phone: meta.phone || "",
      email: meta.email || session.customer_email || "",
      fullName: meta.fullName || "",
      postalCode: meta.postalCode || "",
      houseNumber: meta.houseNumber || "",
      addition: meta.addition || "",
      street: meta.street || "",
      city: meta.city || "",
      address: meta.street
        ? `${meta.street} ${meta.houseNumber}${meta.addition ? ` ${meta.addition}` : ""}, ${meta.postalCode} ${meta.city}`
        : "",
      paymentMethod: "stripe",
      selectedBank: "Stripe Online",
      orderId,
      createdAt: new Date().toISOString(),
      stripeSessionId: session.id,
      amountTotal: session.amount_total,
      currency: session.currency,
    };

    // Trigger magic link to customer's email so they can securely access their dashboard
    let magicLinkSent = false;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && vehicleData.email) {
      try {
        const origin = new URL(req.url).origin;
        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: vehicleData.email,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
          },
        });
        if (!otpError) {
          magicLinkSent = true;
        } else {
          console.warn("OTP error in checkout verify:", otpError.message);
        }
      } catch (otpErr) {
        console.error("Failed to send OTP in checkout verify:", otpErr);
      }
    }

    return NextResponse.json({
      paid: true,
      order: vehicleData,
      magicLinkSent,
    });
  } catch (err: any) {
    console.error("Stripe verify error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify Stripe checkout session" },
      { status: 500 }
    );
  }
}
