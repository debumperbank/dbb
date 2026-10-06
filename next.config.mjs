/** @type {import('next').NextConfig} */
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: supabaseHostname ? [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        pathname: '/storage/v1/object/public/**',
      },
    ] : [],
  },
  async headers() {
    const rules = [
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/bumpr/bestelling/:path*',
        headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }],
      },
      {
        // Applies to every route.
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" },
          // Prevent the site from being embedded in an iframe elsewhere
          // (protects the /admin login against clickjacking).
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stop browsers from guessing content types (MIME sniffing).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Don't leak the full URL (which can include query params) to
          // third-party sites linked from De Bumperbank.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features the site never needs.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
    return [rules[2], rules[0], rules[1]];
  },
};

export default nextConfig;
