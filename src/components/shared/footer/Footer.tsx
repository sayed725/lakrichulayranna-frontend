import Link from "next/link";
import { Logo } from "@/components/shared/logo/Logo";
import { Container } from "@/components/shared/container/Container";
import { NAV_LINKS } from "@/lib/constants";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const currentYear = new Date().getFullYear();

const quickLinks = [
  { label: "হোম", href: "/" },
  { label: "মেনু", href: "/menu" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "যোগাযোগ", href: "/contact" },
];

const customerLinks = [
  { label: "আমার অর্ডার", href: "/dashboard/customer/orders" },
  { label: "আমার প্রোফাইল", href: "/dashboard/customer/profile" },
  { label: "প্রাইভেসি পলিসি", href: "/privacy" },
  { label: "শর্তাবলী", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80 mt-auto">
      {/* Top decorative fire line */}
      <div className="h-1 bg-gradient-to-r from-fire via-terracotta to-fire" />

      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold font-bengali">
                  <span className="text-cream">লাকড়ি চুলায়</span>{" "}
                  <span className="text-fire">রান্না</span>
                </span>
              </Link>
            </div>
            <p className="text-cream/60 text-sm font-bengali leading-relaxed mb-6">
              কাঠের চুলায় রান্না করা খাঁটি বাংলা খাবারের অনলাইন অর্ডার।
              আসল ঐতিহ্যবাহী স্বাদ, আপনার দোরগোড়ায়।
            </p>

            {/* Decorative Bengali script */}
            <div className="text-fire/20 text-4xl font-bengali font-bold select-none leading-tight">
              আগুনের<br />
              পরশে
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-cream font-semibold font-bengali text-lg mb-4">
              দ্রুত লিংক
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-fire transition-colors text-sm font-bengali inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-fire/40 group-hover:bg-fire transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Links */}
          <div>
            <h3 className="text-cream font-semibold font-bengali text-lg mb-4">
              কাস্টমার
            </h3>
            <ul className="space-y-2.5">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-fire transition-colors text-sm font-bengali inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-fire/40 group-hover:bg-fire transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-cream font-semibold font-bengali text-lg mb-4">
              যোগাযোগ
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-cream/60">
                <MapPin size={16} className="text-fire mt-0.5 shrink-0" />
                <span className="font-bengali">
                  ঢাকা, বাংলাদেশ
                </span>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-3 text-sm text-cream/60 hover:text-fire transition-colors"
                >
                  <Phone size={16} className="text-fire shrink-0" />
                  <span>+880 1700-000000</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@lakrichulayranna.com"
                  className="flex items-center gap-3 text-sm text-cream/60 hover:text-fire transition-colors"
                >
                  <Mail size={16} className="text-fire shrink-0" />
                  <span>info@lakrichulayranna.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-cream/60">
                <Clock size={16} className="text-fire mt-0.5 shrink-0" />
                <span className="font-bengali">
                  সকাল ১০টা — রাত ১০টা<br />
                  (প্রতিদিন)
                </span>
              </li>
            </ul>

          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <Container className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/40 text-xs font-bengali">
            © {currentYear} লাকড়ি চুলায় রান্না। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-cream/30 text-xs">
            Built with 🔥 and tradition
          </p>
        </Container>
      </div>
    </footer>
  );
}
