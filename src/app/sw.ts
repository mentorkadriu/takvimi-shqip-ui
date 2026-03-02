import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, ExpirationPlugin, Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Prayer times data — CacheFirst so it works fully offline after first load
    {
      matcher: /\/data\/kosovo-prayer-times\.json$/i,
      handler: new CacheFirst({
        cacheName: 'prayer-times-data',
        plugins: [new ExpirationPlugin({ maxEntries: 1, maxAgeSeconds: 365 * 24 * 60 * 60 })],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
