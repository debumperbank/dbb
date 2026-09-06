/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Applies to every route.
        source: '/:path*',
        headers: [
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
  },
};

export default nextConfig;
