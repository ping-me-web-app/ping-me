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
        { error: "Kenteken en e-mailadres zijn verplicht / License plate and email are required." },
        { status: 400 }
      );
    }

    const cleanedEmail = (email || "").trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail);
    if (!isValidEmail) {
      return NextResponse.json(
        { error: "Vul een geldig e-mailadres in (bijv. naam@domein.nl) / Please enter a valid email address." },
        { status: 400 }
      );
    }

    const phoneDigits = (phone || "").replace(/\D/g, "");
    const isValidPhone =
      channel === "email"
        ? !phone || (phoneDigits.length >= 9 && phoneDigits.length <= 15 && !/[a-zA-Z]/.test(phone))
        : phoneDigits.length >= 9 && phoneDigits.length <= 15 && !/[a-zA-Z]/.test(phone);

    if (!isValidPhone) {
      return NextResponse.json(
        { error: "Vul een geldig mobiel telefoonnummer in (bijv. +31 6 1234 5678) / Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Determine host origin for success / cancel redirects
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe API key (STRIPE_SECRET_KEY) is niet geconfigureerd / Stripe is not configured." },
        { status: 500 }
      );
    }

    // Enable all primary European payment methods (iDEAL, Card, Apple Pay, Google Pay)
    const allowedPaymentMethodTypes: ("card" | "ideal")[] = ["ideal", "card"];

    const generatedOrderId = `PM-NL-${Math.floor(100000 + Math.random() * 900000)}`;
    const generatedToken = `PM-NL-${Math.floor(1000 + Math.random() * 9000)}`;

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
      customer_email: cleanedEmail,
      metadata: {
        orderId: generatedOrderId,
        token: generatedToken,
        plate: plate.toUpperCase(),
        make: make || "",
        model: model || "",
        color: color || "",
        channel: channel || "whatsapp",
        phone: phone || "",
        email: cleanedEmail,
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
