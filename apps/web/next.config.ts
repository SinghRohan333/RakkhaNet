import type { NextConfig } from "next";
import path from "path";
import withPWAInit from "@ducanh2912/next-pwa";

// Where the Express API lives. Read at BUILD time (see rewrites below).
const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? "http://localhost:8080";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === "development",
  // Keep the default page/static caching rules...
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    // ...but never cache API or Socket.io traffic. Private data must not
    // sit in Cache Storage and must not survive sign-out.
    runtimeCaching: [
      {
        urlPattern: ({ url }: { url: URL }) =>
          url.pathname.startsWith("/api/") ||
          url.pathname.startsWith("/socket.io/"),
        handler: "NetworkOnly",
      },
    ],
  },
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // levels up from apps/web to C:\rakkhanet
    root: path.resolve(__dirname, "../../"),
  },
  // Same-origin proxy: the browser talks to the website's own domain, and
  // Vercel forwards /api/* to the Render API. This keeps the login cookie
  // first-party (third-party cookies are blocked by many browsers).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/api/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
