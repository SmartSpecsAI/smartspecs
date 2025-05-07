/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/workflow",
          destination: `${process.env.DIFY_API_URL}/v1/workflows/run`,
        },
      ];
    },
  };
  
  module.exports = nextConfig;