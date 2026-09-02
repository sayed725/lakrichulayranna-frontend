import { Truck, PackageCheck, Headset } from "lucide-react";
import { Container } from "@/components/shared/container/Container";

const features = [
  {
    icon: Truck,
    title: "স্বল্প মূল্যে ডেলিভারি",
    description: "অল্প খরচে এবং স্বল্প সময়ে আপনার প্রিয় খাবার পৌঁছে যাবে।",
  },
  {
    icon: PackageCheck,
    title: "ক্যাশ অন ডেলিভারি",
    description: "ঢাকা আর চট্টগ্রাম তো বটেই - সারাদেশেই আমরা দিচ্ছি ক্যাশ অন ডেলিভারি।",
  },
  {
    icon: Headset,
    title: "দ্রুত সাপোর্ট",
    description: "কোন সমস্যা হলে দ্রুততম সময়ের ভিতর সরাসরি সাপোর্ট পাবেন।",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-cream py-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 sm:gap-5 group"
              >
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-fire/30 group-hover:border-fire flex items-center justify-center bg-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-fire/15">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-fire group-hover:text-fire-dark transition-colors duration-300" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base md:text-lg font-bold font-bengali text-charcoal group-hover:text-fire transition-colors duration-300 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm font-bengali text-muted-dark leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
