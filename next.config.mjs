import { spawnSync } from 'node:child_process';
import withSerwistInit from '@serwist/next';

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout.trim() ||
  crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
  additionalPrecacheEntries: [
    { url: '/', revision },
    { url: '/qibla', revision },
    { url: '/data/kosovo-prayer-times.json', revision },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withSerwist(nextConfig);
