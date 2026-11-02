import fs from "fs";
import path from "path";
import sharp from "sharp";

// Centered Ping Me Emblem inside a 512x512 canvas
// Original emblem center: X = 298, Y = 190, bounds width ~470, height ~250.
// We scale by 0.88 to give an optimal breathing margin inside the rounded squircle.
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#151922" />
      <stop offset="100%" stop-color="#090B0E" />
    </linearGradient>
    <linearGradient id="border-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2E3545" />
      <stop offset="100%" stop-color="#151820" />
    </linearGradient>
  </defs>

  <!-- App icon tile background with premium squircle geometry -->
  <rect width="512" height="512" rx="112" fill="url(#bg-grad)" />
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="url(#border-grad)" stroke-width="8" />

  <!-- Ping Me Master Mark -->
  <g transform="translate(256, 256) scale(0.88) translate(-298, -190)">
    <!-- Outer Windshield Frame -->
    <path fill="none" stroke="#FFFFFF" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"
          d="M 148,94 
             C 178,82 236,71 298,71 
             C 360,71 418,82 448,94 
             C 466,101 474,115 480,131 
             L 520,227 
             C 527,243 518,258 502,266 
             C 445,294 374,308 298,308 
             C 222,308 151,294 94,266 
             C 78,258 69,243 76,227 
             L 116,131 
             C 122,115 130,101 148,94 Z" />

    <!-- Left Resting Wiper Blade -->
    <path fill="none" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"
          d="M 152,246 C 174,258 196,269 220,277" />

    <!-- Right Resting Wiper Blade -->
    <path fill="none" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"
          d="M 444,246 C 422,258 400,269 376,277" />

    <!-- Lime Green Speech Bubble with 3 circular dot cutouts -->
    <path fill="#BCF249" fill-rule="evenodd"
          d="M 240,114 
             L 363,114 
             C 383,114 399,130 399,150 
             L 399,198 
             C 399,218 383,234 363,234 
             L 308,234 
             L 267.5,265 
             L 263,234 
             L 240,234 
             C 220,234 204,218 204,198 
             L 204,150 
             C 204,130 220,114 240,114 Z
             M 253.5,159.1 A 14.5,14.5 0 1 0 253.5,188.1 A 14.5,14.5 0 1 0 253.5,159.1 Z
             M 299.5,159.1 A 14.5,14.5 0 1 0 299.5,188.1 A 14.5,14.5 0 1 0 299.5,159.1 Z
             M 346.0,159.1 A 14.5,14.5 0 1 0 346.0,188.1 A 14.5,14.5 0 1 0 346.0,159.1 Z" />
  </g>
</svg>`;

function buildIcoBuffer(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let currentOffset = 6 + count * 16;
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(currentOffset, 12); // offset
    entries.push(entry);
    currentOffset += img.buffer.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.buffer)]);
}

async function main() {
  const svgBuffer = Buffer.from(faviconSvg, "utf-8");

  // 1. Write SVG icons
  fs.writeFileSync(path.resolve("public/favicon.svg"), faviconSvg, "utf-8");
  fs.writeFileSync(path.resolve("public/icon.svg"), faviconSvg, "utf-8");
  console.log("✓ SVG icons created");

  // 2. Generate PNG sizes
  const [b16, b32, b48, b180, b192, b512] = await Promise.all([
    sharp(svgBuffer).resize(16, 16).png().toBuffer(),
    sharp(svgBuffer).resize(32, 32).png().toBuffer(),
    sharp(svgBuffer).resize(48, 48).png().toBuffer(),
    sharp(svgBuffer).resize(180, 180).png().toBuffer(),
    sharp(svgBuffer).resize(192, 192).png().toBuffer(),
    sharp(svgBuffer).resize(512, 512).png().toBuffer(),
  ]);

  // 3. Apple Touch Icons
  fs.writeFileSync(path.resolve("public/apple-touch-icon.png"), b180);
  console.log("✓ Apple touch icons created (180x180)");

  // 4. Standard PNG icons
  fs.writeFileSync(path.resolve("public/icon-192.png"), b192);
  fs.writeFileSync(path.resolve("public/icon-512.png"), b512);
  console.log("✓ PWA icons created (192x192, 512x512)");

  // 5. Multi-size ICO (16x16, 32x32, 48x48)
  const icoBuffer = buildIcoBuffer([
    { width: 16, height: 16, buffer: b16 },
    { width: 32, height: 32, buffer: b32 },
    { width: 48, height: 48, buffer: b48 },
  ]);
  fs.writeFileSync(path.resolve("public/favicon.ico"), icoBuffer);
  console.log("✓ Multi-size favicon.ico created (16, 32, 48)");

  // 6. Web Manifest
  const manifest = {
    name: "Ping Me — Anoniem bereikbaar voor je voertuig",
    short_name: "Ping Me",
    description: "Laat voorbijgangers anoniem contact opnemen bij parkeerproblemen of noodsituaties via een slimme QR-code sticker.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1117",
    theme_color: "#BCF249",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
  fs.writeFileSync(path.resolve("public/site.webmanifest"), JSON.stringify(manifest, null, 2), "utf-8");
  console.log("✓ site.webmanifest created");
}

main().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
