"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  ShoppingCart,
  CheckCircle2,
  PackageCheck,
  Search,
  CreditCard,
  Truck,
} from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title/SectionTitle";

const steps = [
  {
    icon: Search,
    title: "খাবার নির্বাচন",
    description: "আমাদের বিভিন্ন ক্যাটাগরি থেকে আপনার পছন্দের খাবারটি বেছে নিন।",
    detailedDescription: "আমাদের বৈচিত্র্যময় ঐতিহ্যবাহী মেনু থেকে আপনার পছন্দের খাবারটি খুঁজুন। আমাদের প্রতিটি খাবার কাঠের চুলায় রান্না করা এবং খাঁটি স্বাদে তৈরি।",
    highlights: [
      "ঐতিহ্যবাহী ও খাঁটি স্বাদের খাবার",
      "সহজ ক্যাটাগরি ফিল্টারিং ব্যবস্থা",
      "প্রতি সপ্তাহে নতুন স্পেশাল আইটেম",
    ],
    gradient: "from-amber-400 to-orange-500 dark:from-amber-800 dark:to-orange-800",
    glowColor: "shadow-amber-500/20",
    bgAccent: "bg-amber-500 dark:bg-amber-500",
  },
  {
    icon: ShoppingCart,
    title: "কার্টে যোগ করুন",
    description: "পছন্দের খাবারগুলো কার্টে যুক্ত করুন এবং আপনার অর্ডারটি রিভিও করুন।",
    detailedDescription: "খাবার নির্বাচন করার পর সহজেই কার্টে যুক্ত করুন। আপনি খাবারের পরিমাণ পরিবর্তন করতে পারেন এবং অর্ডার নিশ্চিত করার আগে মোট মূল্য দেখে নিতে পারেন।",
    highlights: [
      "সহজে খাবারের পরিমাণ পরিবর্তন",
      "অর্ডার করার পূর্বে আইটেম রিভিও",
      "কোনো লুকানো খরচ ছাড়াই স্পষ্ট মূল্য",
    ],
    gradient: "from-orange-400 to-red-500 dark:from-orange-800 dark:to-red-800",
    glowColor: "shadow-orange-500/20",
    bgAccent: "bg-orange-500 dark:bg-orange-500",
  },
  {
    icon: CreditCard,
    title: "ক্যাশ অন ডেলিভারি",
    description: "ক্যাশ অন ডেলিভারি (COD) সিলেক্ট করুন এবং নিশ্চিন্তে অর্ডার সম্পন্ন করুন।",
    detailedDescription: "পেমেন্ট নিয়ে কোনো চিন্তা নেই! ক্যাশ অন ডেলিভারি (COD) সিলেক্ট করে অর্ডার দিন। খাবার হাতে পেয়ে তবেই মূল্য পরিশোধ করুন।",
    highlights: [
      "খাবার বুঝে পেয়ে পেমেন্ট করুন",
      "১০০% নিরাপদ ও ঝামেলামুক্ত প্রক্রিয়া",
      "কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই",
    ],
    gradient: "from-amber-400 to-orange-500 dark:from-amber-800 dark:to-orange-800",
    glowColor: "shadow-amber-500/20",
    bgAccent: "bg-amber-500 dark:bg-amber-500"
  },
  {
    icon: CheckCircle2,
    title: "অর্ডার সম্পন্ন",
    description: "আপনার অর্ডারটি সফলভাবে নেওয়া হয়েছে! লাইভ স্ট্যাটাস ট্র্যাক করুন।",
    detailedDescription: "অভিনন্দন! আপনার অর্ডারটি আমরা পেয়েছি। এখন আপনি আপনার ড্যাশবোর্ড থেকে অর্ডারের বর্তমান অবস্থা লাইভ ট্র্যাক করতে পারবেন।",
    highlights: [
      "তাৎক্ষণিক অর্ডার কনফার্মেশন",
      "ড্যাশবোর্ডে রিয়েল-টাইম ট্র্যাকিং",
      "আপনার অর্ডার হিস্ট্রি চেক করার সুবিধা",
    ],
    gradient: "from-orange-400 to-red-500 dark:from-orange-800 dark:to-red-800",
    glowColor: "shadow-orange-500/20",
    bgAccent: "bg-orange-500 dark:bg-orange-500",
  },
  {
    icon: PackageCheck,
    title: "অর্ডার প্রস্তুতি",
    description: "আমাদের টিম অর্ডারটি নিশ্চিত করে ঐতিহ্যবাহী উপায়ে রান্না শুরু করবে।",
    detailedDescription: "আমাদের টিম আপনার অর্ডারের তথ্য যাচাই করে অবিলম্বে প্রিপারেশন শুরু করে। কাঠের চুলায় মাটির হাঁড়িতে ঐতিহ্যবাহী উপায়ে আপনার খাবারটি তাজা প্রস্তুত করা হয়।",
    highlights: [
      "দ্রুত অর্ডার ভেরিফিকেশন",
      "কাঠের চুলায় তাজা ও গরম রান্না",
      "স্বাস্থ্যসম্মত প্যাকেজিং নিশ্চিতকরণ",
    ],
    gradient: "from-amber-400 to-orange-500 dark:from-amber-800 dark:to-orange-800",
    glowColor: "shadow-amber-500/20",
    bgAccent: "bg-amber-500 dark:bg-amber-500"
  },
  {
    icon: Truck,
    title: "হোম ডেলিভারি",
    description: "কাঠের চুলার গরম ও সুস্বাদু খাবার পৌঁছে যাবে সরাসরি আপনার ঠিকানায়।",
    detailedDescription: "আপনার ক্ষুধা মেটাতে আমাদের ডেলিভারি পার্টনার খাবার নিয়ে চলে যাবে আপনার ঠিকানায়। উপভোগ করুন একদম তাজা এবং ঐতিহ্যবাহী স্বাদের রান্না।",
    highlights: [
      "দ্রুত ও নিরাপদ হোম ডেলিভারি",
      "গরম ও তাজা খাবারের নিশ্চয়তা",
      "ঝামেলাহীন ডেলিভারি হ্যান্ডওভার",
    ],
    gradient: "from-orange-400 to-red-500 dark:from-orange-800 dark:to-red-800",
    glowColor: "shadow-orange-500/20",
    bgAccent: "bg-orange-500 dark:bg-orange-500",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 6000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleStepClick = (index: number) => {
    setIsAutoPlaying(false);
    setActiveStep(index);
  };

  const current = steps[activeStep];
  const Icon = current.icon;

  return (
    <section className="relative pt-10 overflow-hidden bg-cream">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto px-4">
          <SectionTitle
            titleBn="অর্ডার করার প্রক্রিয়া"
            // title="How It Works"
            subtitle="সহজ কয়েকটি ধাপে আপনার পছন্দের খাবার পৌঁছে যাবে আপনার ঠিকানায়"
          />
        </div>

        {/* Timeline navigation — Responsive */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-0 w-full max-w-5xl">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === activeStep;
              const isPassed = index < activeStep;

              return (
                <div key={index} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => handleStepClick(index)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 group cursor-pointer transition-all duration-500",
                    )}
                  >
                    {/* Node circle */}
                    <motion.div
                      animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      className={cn(
                        "w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 relative",
                        isActive
                          ? `bg-gradient-to-br ${step.gradient} text-white shadow-lg ${step.glowColor} ring-2 sm:ring-4 ring-white`
                          : isPassed
                          ? "bg-amber-500 text-white ring-1 sm:ring-2 ring-amber-200"
                          : "bg-white text-muted ring-1 sm:ring-2 ring-border group-hover:ring-orange-300"
                      )}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
                      ) : (
                        <StepIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        "text-[10px] sm:text-xs font-bold font-bengali transition-colors duration-300 whitespace-nowrap hidden md:block mt-1",
                        isActive
                          ? "text-orange-600"
                          : isPassed
                          ? "text-amber-600"
                          : "text-muted group-hover:text-charcoal"
                      )}
                    >
                      {step.title}
                    </span>
                  </button>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-[2px] sm:h-[3px] mx-1 sm:mx-2 rounded-full bg-border overflow-hidden relative md:mt-[-28px]">
                      <motion.div
                        initial={false}
                        animate={{ width: isPassed || isActive ? "100%" : "0%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
                          isPassed ? "from-amber-400 to-amber-500" : `${step.gradient}`
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Side – Interactive Step Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl border border-border shadow-xl shadow-fire/5 overflow-hidden h-full">
                {/* Accent bar at top */}
                <div className={cn("h-1.5 bg-gradient-to-r", current.gradient)} />

                <div className="p-6 sm:p-8 lg:p-10 flex flex-col h-full">
                  {/* Step badge & icon */}
                  <div className="flex items-center gap-5 mb-8">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
                        current.gradient,
                        current.glowColor
                      )}
                    >
                      <Icon className="w-8 h-8" strokeWidth={1.8} />
                    </div>
                    <div>
                      <span
                        className={cn(
                          "inline-block text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-1",
                          "bg-gradient-to-r bg-clip-text text-transparent",
                          current.gradient
                        )}
                      >
                        ধাপ {activeStep + 1} / {steps.length}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal">
                        {current.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted font-bengali text-base sm:text-lg leading-relaxed mb-8">
                    {current.detailedDescription}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-4 flex-1">
                    {current.highlights.map((text, i) => (
                      <motion.div
                        key={text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={cn(
                            "mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                            "bg-gradient-to-br",
                            current.gradient
                          )}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold font-bengali text-charcoal">
                          {text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Auto-play progress bar */}
                  {isAutoPlaying && (
                    <div className="mt-8 h-1 bg-border rounded-full overflow-hidden">
                      <motion.div
                        key={activeStep}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className={cn("h-full rounded-full bg-gradient-to-r", current.gradient)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Side – Visual Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div
                className={cn(
                  "relative rounded-3xl overflow-hidden shadow-2xl h-full min-h-[400px] flex flex-col items-center justify-center",
                  current.glowColor
                )}
              >
                {/* Gradient background */}
                <div className={cn("absolute inset-0 bg-gradient-to-br", current.gradient)} />

                {/* Decorative circles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
                  {/* Floating dots */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-12 left-12 w-4 h-4 bg-white/20 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-20 right-16 w-3 h-3 bg-white/25 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 text-white text-center p-8 sm:p-12 flex flex-col items-center">
                  {/* Large icon */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-8"
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                      <Icon className="w-14 h-14 sm:w-16 sm:h-16" strokeWidth={1.5} />
                    </div>
                  </motion.div>

                  {/* Step number */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-4"
                  >
                    <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-bold tracking-widest uppercase border border-white/10">
                      Step {activeStep + 1}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold font-bengali text-white mb-4 tracking-tight drop-shadow"
                  >
                    {current.title}
                  </motion.h3>

                  {/* Short desc */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-base sm:text-lg font-medium text-white/90 max-w-sm leading-relaxed font-bengali"
                  >
                    {current.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
