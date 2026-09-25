import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statisk eksport: `npm run build` lager mappen `out/` med ferdige HTML-filer
  // som kan legges rett på Netlify, GitHub Pages eller en hvilken som helst webserver.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
