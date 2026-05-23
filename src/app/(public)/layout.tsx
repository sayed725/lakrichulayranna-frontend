import { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar/Navbar";
import { Footer } from "@/components/shared/footer/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "হোম | লাকড়ি চুলায় রান্না",
  description: "আসল কাঠের চুলার স্বাদ, এখন আপনার দোরগোড়ায়।",
  openGraph: {
    title: "হোম | লাকড়ি চুলায় রান্না",
    description: "আসল কাঠের চুলার স্বাদ, এখন আপনার দোরগোড়ায়।",
    siteName: "লাকড়ি চুলায় রান্না",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
