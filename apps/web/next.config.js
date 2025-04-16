// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    domains: ['localhost'],
  },
  i18n: {
    locales: ['en', 'hi', 'bn', 'ta', 'te', 'kn'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

module.exports = nextConfig;
