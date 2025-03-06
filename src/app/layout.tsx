import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import PWAInstall from "./components/PWAInstall";
import OfflineNotification from "./components/OfflineNotification";

export const metadata: Metadata = {
  title: "Takvimi Shqip - Islamic Prayer Times",
  description: "Islamic prayer times and Qibla direction for Muslims",
  keywords: ["prayer times", "qibla", "albania", "kosovo", "islamic app"],
  manifest: "/manifest.json",
  icons: {
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
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
    <html lang="en">
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
        <ServiceWorkerRegistration />
        <OfflineNotification />
        {children}
        <PWAInstall />
      </body>
    </html>
  );
}
