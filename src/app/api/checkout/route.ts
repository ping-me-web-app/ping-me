import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      plate,
      make,
      model,
      color,
      channel,
      phone,
      email,
      fullName,
      postalCode,
      houseNumber,
      addition,
      street,
      city,
      paymentMethod,
    } = body;

    if (!plate || !email) {
      return NextResponse.json(
        { error: "License plate and email are required." },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Determine host origin for success / cancel redirects
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

    // If Stripe keys are not yet configured in environment variables, provide fallback
    if (!stripe) {
      return NextResponse.json({
        configured: false,
        message: "Stripe API key (STRIPE_SECRET_KEY) not configured. In test mode.",
        mock: true,
      });
    }

    // Payment methods for Stripe Checkout
    const allowedPaymentMethodTypes =
      paymentMethod === "card" ? (["card"] as const) : (["ideal", "card"] as const);

    const session = await stripe.checkout.sessions.create({
      allowed_payment_method_types: [...allowedPaymentMethodTypes],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 1000, // €10.00
            product_data: {
              name: `Ping-Me Sticker Tag (${plate.toUpperCase()})`,
              description: "Anonymous Vehicle QR Sticker + 1 Year Protected Notification Forwarding",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      metadata: {
        plate: plate.toUpperCase(),
        make: make || "",
        model: model || "",
        color: color || "",
        channel: channel || "whatsapp",
        phone: phone || "",
        email,
        fullName: fullName || "",
        postalCode: postalCode || "",
        houseNumber: houseNumber || "",
        addition: addition || "",
        street: street || "",
        city: city || "",
      },
      success_url: `${origin}/order?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order?payment=cancelled`,
    });

    return NextResponse.json({
      configured: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
