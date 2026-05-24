import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "লাকড়ি চুলায় রান্না — আসল কাঠের চুলার স্বাদ",
    template: "%s | লাকড়ি চুলায় রান্না",
  },
  description:
    "লাকড়ি চুলায় রান্না — কাঠের চুলায় রান্না করা খাঁটি বাংলা খাবারের অনলাইন অর্ডার। আসল ঐতিহ্যবাহী স্বাদ, আপনার দোরগোড়ায়।",
  keywords: [
    "লাকড়ি চুলায় রান্না",
    "কাঠের চুলার খাবার",
    "বাংলা খাবার",
    "ঐতিহ্যবাহী রান্না",
    "অনলাইন ফুড অর্ডার",
    "traditional Bengali food",
    "wood fire cooking",
  ],
  authors: [{ name: "লাকড়ি চুলায় রান্না" }],
  icons: {
    icon: "/lakri_chulay_ranna_logo.png",
    apple: "/lakri_chulay_ranna_logo.png",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "লাকড়ি চুলায় রান্না",
    title: "লাকড়ি চুলায় রান্না — আসল কাঠের চুলার স্বাদ",
    description:
      "কাঠের চুলায় রান্না করা খাঁটি বাংলা খাবারের অনলাইন অর্ডার।",
    images: [
      {
        url: "/lakri_chulay_ranna_cover_photo.jpg",
        width: 2061,
        height: 763,
        alt: "লাকড়ি চুলায় রান্না কাভার ছবি",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" data-scroll-behavior="smooth" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="font-bengali antialiased">
        <ThemeProvider>
          <NextTopLoader color="oklch(0.65 0.20 45)" showSpinner={false} />
          <QueryProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-fire text-white px-4 py-2 rounded-xl z-[100] font-bengali font-bold focus:outline-none focus:ring-4 focus:ring-fire/50">
              মূল কন্টেন্টে যান
            </a>
            {children}
            <Toaster
              position="top-right"
              duration={4000}
              toastOptions={{
                style: {
                  background: "var(--card-bg, #FDF6EC)",
                  color: "var(--foreground, #2C2421)",
                  border: "1px solid var(--card-border, #e8ddd5)",
                  fontFamily: "var(--font-bengali, 'Hind Siliguri', sans-serif)",
                  fontSize: "14px",
                },
                classNames: {
                  toast: "rounded-xl shadow-lg",
                  success: "border-l-4 border-l-[#22C55E]",
                  error: "border-l-4 border-l-[#EF4444]",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
