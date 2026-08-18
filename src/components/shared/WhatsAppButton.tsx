"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const WhatsAppButton = ({ className }: { className?: string }) => {
  const phoneNumber = "+8801627142598";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-shadow duration-300 group ${className || ""}`}
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse effect */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />

      <FaWhatsapp className="w-8 h-8 relative z-10" />

      {/* Tooltip */}
      <span className="absolute right-16 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border dark:border-slate-800">
        Chat with us
      </span>
    </motion.a>
  );
};

export default WhatsAppButton;
