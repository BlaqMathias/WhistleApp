import nextPWA from "next-pwa";
import { spawn } from "node:child_process";

if (
  process.env.NODE_ENV === "development" &&
  process.env.WHISTLE_TEST_SERVICE === "1"
) {
  const child = spawn(process.execPath, ["tests/support/service.mjs"], {
    stdio: "ignore",
  });
  process.on("exit", () => child.kill());
}

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: false,
  skipWaiting: true,
  cacheStartUrl: false,
  dynamicStartUrl: false,
  buildExcludes: [/app-build-manifest\.json$/, /.*\.map$/],
  publicExcludes: ["!**/test-*"],
  runtimeCaching: [
    { urlPattern: /\/.*$/, handler: "NetworkOnly", method: "GET" },
  ],
});

export default withPWA({
  // Running a production build must never overwrite a live dev server's chunks.
  // Acceptance tests also have their own manifests and cache.
  distDir:
    process.env.NODE_ENV === "development"
      ? process.env.WHISTLE_TEST_SERVICE === "1"
        ? ".next-http-tests"
        : ".next-dev"
      : ".next",
  reactStrictMode: true,
  devIndicators: false,
  async rewrites() {
    // Local test transport only; never enabled in production or by the setup template.
    return process.env.NODE_ENV === "development" &&
      process.env.WHISTLE_TEST_SERVICE === "1"
      ? [
          {
            source: "/__test_supabase/:path*",
            destination: "http://127.0.0.1:4318/:path*",
          },
        ]
      : [];
  },
  poweredByHeader: false,
  experimental: { cpus: 2 },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
});
