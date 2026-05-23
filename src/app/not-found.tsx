import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      {/* Decorative fire embers background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-fire/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-terracotta/5 blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* 404 Number with fire gradient */}
        <h1 className="text-[10rem] leading-none font-black bg-gradient-to-b from-fire via-terracotta to-charcoal bg-clip-text text-transparent select-none">
          ৪০৪
        </h1>

        {/* Bengali message */}
        <h2 className="text-3xl font-bold text-charcoal font-bengali -mt-4 mb-3">
          পৃষ্ঠা খুঁজে পাওয়া যায়নি
        </h2>

        <p className="text-muted font-bengali text-lg mb-2">
          দুঃখিত! আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।
        </p>

        <p className="text-muted-light text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Decorative fire line */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-fire/50" />
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-fire">
            <path
              fill="currentColor"
              d="M12 2C8 7 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-7-8-12zm0 18c-3.3 0-6-2.7-6-6 0-2.8 3-5.8 6-10 3 4.2 6 7.2 6 10 0 3.3-2.7 6-6 6z"
            />
          </svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-fire/50" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-fire text-white font-semibold rounded-xl hover:bg-fire-dark transition-all duration-300 hover:shadow-lg hover:shadow-fire/25 active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            <span className="font-bengali">হোমে ফিরুন</span>
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-charcoal/20 text-charcoal font-semibold rounded-xl hover:border-fire hover:text-fire transition-all duration-300 active:scale-95"
          >
            <span className="font-bengali">মেনু দেখুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
