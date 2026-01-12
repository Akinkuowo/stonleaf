import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'STONLEAF | Curate Your Next Collection',
  description: 'Premium collection curation services',
  keywords: ['art', 'curated collection', 'curation services', 'premium collection'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
