"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-error/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full bg-fire/5 blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* Error icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Bengali error message */}
        <h2 className="text-3xl font-bold text-charcoal font-bengali mb-3">
          কিছু একটা ভুল হয়েছে!
        </h2>

        <p className="text-muted font-bengali text-lg mb-2">
          দুঃখিত, একটি অপ্রত্যাশিত সমস্যা হয়েছে।
        </p>

        <p className="text-muted-light text-sm mb-8">
          Something went wrong. Please try again.
        </p>

        {/* Error details in dev mode */}
        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left p-4 rounded-xl bg-charcoal/5 border border-charcoal/10">
            <summary className="cursor-pointer text-sm font-medium text-charcoal">
              Error Details
            </summary>
            <pre className="mt-2 text-xs text-error overflow-auto p-2 rounded bg-white/50">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-1 text-xs text-muted-light">
                Digest: {error.digest}
              </p>
            )}
          </details>
        )}

        {/* Decorative fire line */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-error/30" />
          <div className="w-2 h-2 rounded-full bg-error/40" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-error/30" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-fire text-white font-semibold rounded-xl hover:bg-fire-dark transition-all duration-300 hover:shadow-lg hover:shadow-fire/25 active:scale-95 cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23,4 23,10 17,10" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
            <span className="font-bengali">আবার চেষ্টা করুন</span>
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-charcoal/20 text-charcoal font-semibold rounded-xl hover:border-fire hover:text-fire transition-all duration-300 active:scale-95"
          >
            <span className="font-bengali">হোমে ফিরুন</span>
          </a>
        </div>
      </div>
    </div>
  );
}
