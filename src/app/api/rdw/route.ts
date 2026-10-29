import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPlate = searchParams.get("plate");

  if (!rawPlate) {
    return NextResponse.json({ error: "Missing plate parameter" }, { status: 400 });
  }

  const cleaned = rawPlate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // Demo fallback for standard mock plates
  if (cleaned === "K123XX") {
    return NextResponse.json({
      found: true,
      plate: "K-123-XX",
      make: "VOLKSWAGEN",
      model: "GOLF 8",
      color: "ZWART",
    });
  }

  try {
    const res = await fetch(`https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${cleaned}`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache lookup for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ found: false });
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const v = data[0];
      return NextResponse.json({
        found: true,
        plate: cleaned,
        make: v.merk || "",
        model: v.handelsbenaming || "",
        color: v.eerste_kleur || "",
      });
    }

    return NextResponse.json({ found: false });
  } catch (err) {
    console.error("RDW lookup error:", err);
    return NextResponse.json({ found: false });
  }
}
