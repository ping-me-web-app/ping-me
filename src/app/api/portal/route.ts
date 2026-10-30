import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Stripe customerId is required to open the billing portal." },
        { status: 400 }
      );
    }

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    const returnUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}/dashboard`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error("Stripe portal error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create portal session" },
      { status: 500 }
    );
  }
}
