"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock save
    setTimeout(() => {
      setIsLoading(false);
      toast.success("সেটিংস সফলভাবে সেভ করা হয়েছে");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-bengali text-charcoal mb-1">
          সিস্টেম সেটিংস
        </h1>
        <p className="text-muted text-sm font-bengali">রেস্টুরেন্টের সাধারণ তথ্য ও সেটিংস আপডেট করুন</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold font-bengali text-charcoal border-b border-border pb-4">
            সাধারণ তথ্য
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <FormInput
              label="রেস্টুরেন্টের নাম"
              defaultValue="লাকড়ি চুলায় রান্না"
              placeholder="নাম লিখুন"
            />
            <FormInput
              label="ট্যাগলাইন"
              defaultValue="আগুনের আঁচে রান্না, ভালোবাসায় পরিবেশন"
              placeholder="ট্যাগলাইন লিখুন"
            />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <FormInput
              label="মোবাইল নম্বর"
              defaultValue="01XXXXXXXXX"
              placeholder="নম্বর দিন"
            />
            <FormInput
              label="ইমেইল"
              type="email"
              defaultValue="info@lakrichulayranna.com"
              placeholder="ইমেইল দিন"
            />
          </div>

          <FormTextarea
            label="ঠিকানা"
            defaultValue="ঢাকা, বাংলাদেশ"
            placeholder="বিস্তারিত ঠিকানা"
          />
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold font-bengali text-charcoal border-b border-border pb-4">
            সোশ্যাল মিডিয়া ও অন্যান্য
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <FormInput
              label="Facebook লিংক"
              placeholder="https://facebook.com/..."
            />
            <FormInput
              label="Instagram লিংক"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <FormInput
              label="খোলার সময়"
              defaultValue="সকাল ১০:০০ টা"
            />
            <FormInput
              label="বন্ধের সময়"
              defaultValue="রাত ১১:০০ টা"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3.5 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save size={20} />
            {isLoading ? "সেভ হচ্ছে..." : "সেভ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
