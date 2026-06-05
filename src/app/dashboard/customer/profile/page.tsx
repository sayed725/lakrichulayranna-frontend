"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Lock, User, Phone, MapPin } from "lucide-react";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(3, "নাম কমপক্ষে ৩ অক্ষরের হতে হবে"),
  phone: z.string().regex(/^(01)[3-9][0-9]{8}$/, "সঠিক বাংলাদেশী মোবাইল নম্বর দিন"),
  address: z.string().min(10, "বিস্তারিত ঠিকানা দিন"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "বর্তমান পাসওয়ার্ড দিন"),
  newPassword: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "নতুন পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function CustomerProfilePage() {
  const { user } = useAuthStore();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    // Mock API call
    setTimeout(() => {
      setIsUpdatingProfile(false);
      toast.success("প্রোফাইল আপডেট করা হয়েছে!");
    }, 1000);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    setIsUpdatingPassword(true);
    // Mock API call
    setTimeout(() => {
      setIsUpdatingPassword(false);
      toast.success("পাসওয়ার্ড পরিবর্তন করা হয়েছে!");
      resetPassword();
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal mb-1">
          আমার প্রোফাইল
        </h1>
        <p className="text-muted font-bengali">আপনার ব্যক্তিগত তথ্য এবং পাসওয়ার্ড আপডেট করুন</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-cream-dark/30 flex items-center gap-3">
          <User className="text-fire" size={24} />
          <h2 className="text-xl font-bold font-bengali text-charcoal">ব্যক্তিগত তথ্য</h2>
        </div>
        
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="p-6 sm:p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="relative">
              <User size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="সম্পূর্ণ নাম"
                {...registerProfile("name")}
                error={profileErrors.name?.message}
              />
            </div>
            
            <div className="relative">
              <Phone size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="মোবাইল নম্বর"
                {...registerProfile("phone")}
                error={profileErrors.phone?.message}
              />
            </div>
          </div>

          <div className="relative">
            <MapPin size={18} className="absolute right-4 top-10 text-muted-light" />
            <FormTextarea
              label="ডেলিভারি ঠিকানা"
              placeholder="বাসা নং, রাস্তা, এলাকা..."
              {...registerProfile("address")}
              error={profileErrors.address?.message}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="flex items-center gap-2 px-8 py-3.5 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
            >
              <Save size={20} />
              {isUpdatingProfile ? "সেভ হচ্ছে..." : "সেভ করুন"}
            </button>
          </div>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-cream-dark/30 flex items-center gap-3">
          <Lock className="text-fire" size={24} />
          <h2 className="text-xl font-bold font-bengali text-charcoal">পাসওয়ার্ড পরিবর্তন</h2>
        </div>
        
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="p-6 sm:p-8 space-y-6">
          <FormInput
            type="password"
            label="বর্তমান পাসওয়ার্ড"
            {...registerPassword("currentPassword")}
            error={passwordErrors.currentPassword?.message}
          />
          
          <div className="grid sm:grid-cols-2 gap-6">
            <FormInput
              type="password"
              label="নতুন পাসওয়ার্ড"
              {...registerPassword("newPassword")}
              error={passwordErrors.newPassword?.message}
            />
            <FormInput
              type="password"
              label="পাসওয়ার্ড নিশ্চিত করুন"
              {...registerPassword("confirmPassword")}
              error={passwordErrors.confirmPassword?.message}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="flex items-center gap-2 px-8 py-3.5 bg-fire text-white rounded-xl font-bold font-bengali hover:bg-fire-dark transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95 "
            >
              <Lock size={20} />
              {isUpdatingPassword ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
