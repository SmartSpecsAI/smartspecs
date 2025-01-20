import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
