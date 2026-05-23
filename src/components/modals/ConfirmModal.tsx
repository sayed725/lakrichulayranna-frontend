"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  loading?: boolean;
}

const variantStyles = {
  danger: {
    icon: "bg-error/10 text-error",
    button: "bg-error hover:bg-red-600",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    button: "bg-warning hover:bg-amber-600",
  },
  default: {
    icon: "bg-fire/10 text-fire",
    button: "bg-fire hover:bg-fire-dark",
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  titleBn = "আপনি কি নিশ্চিত?",
  description,
  descriptionBn = "এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না।",
  confirmText = "নিশ্চিত করুন",
  cancelText = "বাতিল",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                {/* Icon */}
                <div
                  className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}
                >
                  <AlertTriangle size={24} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold font-bengali text-charcoal mb-1">
                  {titleBn}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted font-bengali leading-relaxed">
                  {descriptionBn}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl border-2 border-charcoal/10 text-charcoal font-semibold font-bengali text-sm hover:border-charcoal/20 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 py-3 rounded-xl text-white font-semibold font-bengali text-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer ${styles.button}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      অপেক্ষা করুন
                    </span>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
