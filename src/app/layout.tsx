import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Takvimi Shqip - Islamic Prayer Times",
  description: "Islamic prayer times and Qibla direction for Muslims",
  keywords: ["prayer times", "qibla", "albania", "kosovo", "islamic app"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
