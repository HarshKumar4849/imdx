import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMDX | Partnering with Tecmotiv Solutions",
  description: "IMDX, partnering with Tecmotiv Solutions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
