"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Utensils } from "lucide-react";
import { Container } from "@/components/shared/container/Container";

const fireParticles = Array.from({ length: 20 }, (_, index) => {
  const seed = index + 1;

  return {
    left: `${(seed * 37) % 100}%`,
    size: `${4 + ((seed * 5) % 8)}px`,
    backgroundColor: seed % 2 === 0 ? "#E85D24" : "#F4845F",
    y: -200 - ((seed * 29) % 400),
    x: ((seed * 17) % 100) - 50,
    scale: 0.5 + ((seed * 7) % 50) / 100,
    duration: 3 + ((seed * 11) % 20) / 10,
    delay: ((seed * 13) % 20) / 10,
  };
});

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-charcoal">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/lakri_chulay_ranna_cover_photo.jpg"
          alt="লাকড়ি চুলায় রান্না কাভার ছবি"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/50 to-transparent" />
      </div>

      {/* Animated Fire/Smoke Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {fireParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 rounded-full mix-blend-screen"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.backgroundColor,
              boxShadow: "0 0 10px 2px rgba(232, 93, 36, 0.5)",
            }}
            animate={{
              y: [0, particle.y],
              x: [0, particle.x],
              opacity: [0, 0.8, 0],
              scale: [1, particle.scale, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <Container className="relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fire/20 border border-fire/30 backdrop-blur-sm mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fire"></span>
            </span>
            <span className="text-fire-light font-bengali text-sm font-semibold tracking-wide">
              ১০০% খাঁটি দেশীয় স্বাদ
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold font-bengali text-cream leading-[1.1] mb-6"
          >
            আগুনের আঁচে <span className="text-fire relative inline-block">
              রান্না
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8 C50 2, 100 2, 198 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
            <br />
            ভালোবাসায় পরিবেশন
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-cream/70 font-latin max-w-xl mb-10 leading-relaxed"
          >
            Authentic wood-fire cooking, served with love. Experience the traditional flavors of Bengal delivered straight to your door.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-fire text-white font-semibold font-bengali text-lg rounded-xl hover:bg-fire-dark transition-all duration-300 hover:shadow-xl hover:shadow-fire/30 active:scale-95 group"
            >
              <Utensils size={20} className="group-hover:rotate-12 transition-transform" />
              অর্ডার করুন
            </Link>
            
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-cream/20 text-cream font-semibold font-bengali text-lg rounded-xl hover:border-fire hover:text-fire hover:bg-fire/5 transition-all duration-300 active:scale-95 group"
            >
              আমাদের মেনু দেখুন
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
