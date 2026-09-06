import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles/globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ToastContainer from "@/components/ui/Toast";
import { ClerkProvider } from "@clerk/nextjs";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Lumière — Premium Fashion",
    template: "%s | Lumière",
  },
  description:
    "Discover timeless luxury fashion at Lumière. Curated collections of premium clothing and dresses.",
  keywords: ["luxury fashion", "premium clothing", "designer wear", "Lumière"],
  authors: [{ name: "Lumière" }],
  creator: "Lumière",
  metadataBase: new URL("https://lumiere.fashion"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lumiere.fashion",
    siteName: "Lumière",
    title: "Lumière — Premium Fashion",
    description:
      "Discover timeless luxury fashion at Lumière. Curated collections of premium clothing.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lumière Premium Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumière — Premium Fashion",
    description: "Discover timeless luxury fashion at Lumière.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#D4AF37",
          colorText: "#18181b",
          colorTextSecondary: "#71717a",
          colorBackground: "#ffffff",
          colorInputBackground: "#fafaf9",
          colorInputText: "#18181b",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        },
        elements: {
          formButtonPrimary:
            "bg-[#D4AF37] hover:bg-[#c5a030] text-black font-bold text-xs tracking-[0.1em] uppercase py-3 rounded-xl transition-all shadow-md hover:shadow-lg",
          card: "bg-white border border-zinc-200/80 shadow-lg rounded-2xl",
          headerTitle: "font-serif text-xl tracking-wide text-zinc-900",
          headerSubtitle: "text-zinc-500 text-xs",
          footerActionLink: "text-[#b58c1c] hover:text-[#D4AF37] font-semibold text-xs",
          footerActionText: "text-zinc-500 text-xs",
          userButtonAvatarBox: "w-8 h-8 border-2 border-[#D4AF37]/30",
        },
      }}
    >
      <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
        <body>
          <AuthProvider>
            <NotificationProvider>
              <WishlistProvider>
                <CartProvider>
                  {children}
                  <ToastContainer />
                </CartProvider>
              </WishlistProvider>
            </NotificationProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
