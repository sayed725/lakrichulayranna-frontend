"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, FileText } from "lucide-react";
import { Container } from "@/components/shared/container/Container";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen bg-cream py-20 flex items-center justify-center px-4">
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-fire/5 border border-border p-8 sm:p-12 text-center relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-success/10 to-transparent pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6 relative z-10"
          >
            <CheckCircle2 size={48} className="text-success" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold font-bengali text-charcoal mb-4">
              অর্ডার সফল হয়েছে!
            </h1>
            
            <p className="text-muted font-bengali text-lg mb-8 max-w-md mx-auto">
              ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমরা দ্রুত খাবার প্রস্তুত করে পাঠিয়ে দেব।
            </p>

            {orderNumber && (
              <div className="inline-block bg-cream-dark border border-border rounded-xl p-4 mb-10">
                <p className="text-sm text-muted font-bengali mb-1">অর্ডার নম্বর</p>
                <p className="text-2xl font-bold font-mono tracking-widest text-charcoal">
                  #{orderNumber}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/customer/orders"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-charcoal text-white font-semibold font-bengali rounded-xl hover:bg-charcoal-light transition-all active:scale-95"
              >
                <FileText size={18} />
                অর্ডার ট্র্যাক করুন
              </Link>
              <Link
                href="/menu"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-fire/10 text-fire border border-transparent hover:border-fire/20 font-semibold font-bengali rounded-xl transition-all active:scale-95"
              >
                <ShoppingBag size={18} />
                আরও অর্ডার করুন
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
