import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // This replaces `next export`
  reactStrictMode: true,
  trailingSlash: true, // Recommended for GitHub Pages
};

export default nextConfig;
