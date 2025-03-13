import { type NextConfig } from "next";

// Import env here to validate during build.
import "./src/config/env";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  // Enable image optimization for better performance
  images: {
    domains: [],
    unoptimized: false,
  },
  // Ensure prefetching is enabled (this is the default, but making it explicit)
  reactStrictMode: true,
  // Configure prefetching behavior
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
};

export default nextConfig;
