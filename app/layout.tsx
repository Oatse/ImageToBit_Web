import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image to RGB Matrix Converter",
  description: "Convert images to RGB matrix table with pixel inspection and CSV export",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
