import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Lumière Admin & API Portal",
  description: "Lumière Luxury Fashion Admin Dashboard and API Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", backgroundColor: "#0e0e0e", color: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
