/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/workflow",
          destination: "http://localhost/v1/workflows/run",
        },
      ];
    },
  };
  
  module.exports = nextConfig;