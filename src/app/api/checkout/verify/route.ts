import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

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
    const orderId = `PM-NL-${session.id.slice(-6).toUpperCase()}`;
    // Use last 4 characters of session ID or a generated token
    const token = `PM-NL-${session.id.slice(-4).toUpperCase()}`;

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

    return NextResponse.json({
      paid: true,
      order: vehicleData,
    });
  } catch (err: any) {
    console.error("Stripe verify error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify Stripe checkout session" },
      { status: 500 }
    );
  }
}
