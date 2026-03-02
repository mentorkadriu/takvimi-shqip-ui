import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import OfflineNotification from './components/OfflineNotification';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Takvimi Shqip - Kohet e Namazit',
  description: 'Kohet e namazit dhe drejtimi i Kiblës për Kosovë dhe Shqipëri',
  keywords: [
    'prayer times',
    'kohet e namazit',
    'takvim',
    'qibla',
    'kosove',
    'shqiperi',
    'islamic app',
  ],
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" className={inter.variable}>
      <head>
        <meta name="application-name" content="Takvimi Shqip" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Takvimi Shqip" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <OfflineNotification />
        {children}
      </body>
    </html>
  );
}
