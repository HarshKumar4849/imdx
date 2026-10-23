import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tractus-X | Open Source Community",
  description: "Welcome to the Tractus-X open source community.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
