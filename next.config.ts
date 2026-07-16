import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Applies to every route — pure HTTP response headers,
        // no effect on rendered content or behavior.
        source: "/:path*",
        headers: [
          // Stops the site from being embedded in a hostile iframe (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers from guessing/re-interpreting file content types
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limits how much referrer info leaks to other sites on outbound links
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disables browser features this site never uses
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;