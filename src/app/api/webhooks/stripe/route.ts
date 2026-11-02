import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe or STRIPE_WEBHOOK_SECRET is not configured." },
      { status: 500 }
    );
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    const plate = meta.plate;
    const email = meta.email || session.customer_email;
    const token = meta.token || `PM-NL-${session.id.slice(-4).toUpperCase()}`;

    // Optional: Synchronize directly with Supabase if secret / service key is provided
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && secretKey && email && plate) {
      try {
        const adminSupabase = createClient(supabaseUrl, secretKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        // 1. Check or update user profile with Stripe customer ID
        const customerId = typeof session.customer === "string" ? session.customer : undefined;

        const { data: profile } = await adminSupabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        const userId = profile?.id;

        if (userId) {
          if (customerId) {
            await adminSupabase
              .from("profiles")
              .update({ stripe_customer_id: customerId })
              .eq("id", userId);
          }

          // 1. Ensure user profile exists with contact preference
          await adminSupabase.from("profiles").upsert({
            id: userId,
            email: email,
            full_name: meta.fullName || "",
            phone_number: meta.phone || null,
            preferred_channel: meta.channel || "whatsapp",
          });

          // 2. Insert vehicle
          const { data: vehicle, error: vehicleErr } = await adminSupabase
            .from("vehicles")
            .insert({
              owner_id: userId,
              license_plate: plate,
              make: meta.make || "Auto",
              model: meta.model || "",
              color: meta.color || "Onbekend",
            })
            .select()
            .single();

          if (!vehicleErr && vehicle) {
            // 3. Insert tag linked to vehicle
            await adminSupabase.from("tags").insert({
              token,
              vehicle_id: vehicle.id,
              is_active: true,
            });
          }
        }
      } catch (dbErr) {
        console.error("Failed to persist order to Supabase in webhook:", dbErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
