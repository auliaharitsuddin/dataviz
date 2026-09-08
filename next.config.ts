import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pins the workspace root to this project so Turbopack doesn't get confused
  // by the unrelated package-lock.json in the parent home directory.
  turbopack: {
    root: path.join(__dirname),
  },
  // pdf-parse (via pdfjs-dist) resolves its worker file relative to its own
  // package on disk at runtime; bundling it breaks that resolution.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
