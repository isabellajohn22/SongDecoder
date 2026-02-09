/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Configure image domains for album art
  images: {
    remotePatterns: [
      // Last.fm album images
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
        pathname: '/i/u/**',
      },
      // Legacy Spotify images (in case of cached data)
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
      },
    ],
  },
};

module.exports = nextConfig;
