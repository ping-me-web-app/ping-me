import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPostcode = searchParams.get("postalCode") || searchParams.get("postcode");
  const rawHouseNumber = searchParams.get("houseNumber") || searchParams.get("huisnummer");

  if (!rawPostcode || !rawHouseNumber) {
    return NextResponse.json(
      { error: "Both postalCode and houseNumber are required" },
      { status: 400 }
    );
  }

  // Clean postcode: strip whitespace, convert to uppercase (e.g., '1014 AD' -> '1014AD')
  const cleanedPostcode = rawPostcode.replace(/\s+/g, "").toUpperCase();
  // Extract digits for house number
  const houseNumberMatch = rawHouseNumber.match(/\d+/);
  if (!houseNumberMatch) {
    return NextResponse.json({ found: false, error: "Invalid house number" });
  }
  const cleanedHouseNumber = houseNumberMatch[0];

  try {
    const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?fq=postcode:${encodeURIComponent(
      cleanedPostcode
    )}&fq=huisnummer:${encodeURIComponent(cleanedHouseNumber)}&fq=type:adres`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 }, // Cache address lookups for 24 hours
    });

    if (!res.ok) {
      return NextResponse.json({ found: false });
    }

    const data = await res.json();
    const docs = data?.response?.docs;

    if (Array.isArray(docs) && docs.length > 0) {
      const doc = docs[0];
      return NextResponse.json({
        found: true,
        street: doc.straatnaam || "",
        city: doc.woonplaatsnaam || doc.gemeentenaam || "",
        province: doc.provincienaam || "",
        formatted: doc.weergavenaam || "",
      });
    }

    return NextResponse.json({ found: false });
  } catch (err: any) {
    console.error("PDOK address lookup error:", err);
    return NextResponse.json({ found: false, error: err.message });
  }
}
