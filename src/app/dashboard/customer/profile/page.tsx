"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Lock, User, Phone, MapPin, Eye, EyeOff, ShieldCheck, Mail } from "lucide-react";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useUpdateProfile, useChangePassword } from "@/features/user/hooks/useUpdateProfile";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
} as const;

export default function CustomerProfilePage() {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, resetProfile]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    if (data.currentPassword === data.newPassword) {
      toast.error("নতুন পাসওয়ার্ড এবং বর্তমান পাসওয়ার্ড একই হতে পারবে না!");
      return;
    }
    changePassword.mutate(data, {
      onSuccess: () => {
        resetPassword();
      },
    });
  };

  // Helper to extract first two letters of user's name for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Title */}
      <motion.div {...fadeInUp}>
        <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-charcoal mb-1">
          আমার প্রোফাইল
        </h1>
        <p className="text-muted font-bengali">আপনার ব্যক্তিগত তথ্য এবং পাসওয়ার্ড আপডেট করুন</p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <motion.div 
          {...fadeInUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* User Card */}
          <div className="bg-gradient-to-br from-charcoal via-charcoal-light to-[#3d2c27] text-cream rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-charcoal-light flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-40 h-40 bg-fire rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3" />
            
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fire to-orange-400 p-1 shadow-lg shadow-fire/20 relative z-10 mb-5">
              <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center font-bold text-3xl text-fire font-latin select-none">
                {getInitials(user?.name || "")}
              </div>
            </div>

            {/* User Info */}
            <h3 className="text-xl font-bold font-bengali text-cream mb-1 relative z-10">
              {user?.name || "ব্যবহারকারী"}
            </h3>
            <span className="px-3 py-1 rounded-full bg-fire/20 border border-fire/30 text-fire text-xs font-semibold font-bengali mb-6 relative z-10">
              কাস্টমার অ্যাকাউন্ট
            </span>

            {/* Quick Contact Info */}
            <div className="w-full border-t border-cream/10 pt-6 space-y-4 text-left text-sm text-cream/70 font-bengali">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cream/10 flex items-center justify-center text-fire shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-cream/40">মোবাইল নম্বর</p>
                  <p className="font-latin font-semibold text-cream">{user?.phone || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cream/10 flex items-center justify-center text-fire shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-cream/40">ইমেইল ঠিকানা</p>
                  <p className="font-latin font-semibold text-cream">{user?.email || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
            <h4 className="font-bold text-charcoal font-bengali mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-fire" /> নিরাপত্তা ও সুরক্ষা
            </h4>
            <p className="text-xs text-muted font-bengali leading-relaxed">
              আপনার অ্যাকাউন্টের নিরাপত্তা রক্ষা করতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন। লগইন তথ্য বা পাসওয়ার্ড কারো সাথে শেয়ার করা থেকে বিরত থাকুন।
            </p>
          </div>
        </motion.div>

        {/* Right Column: Profile forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Form Card */}
          <motion.div 
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6 border-b border-border bg-cream/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-fire shrink-0">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold font-bengali text-charcoal">ব্যক্তিগত তথ্য</h2>
                <p className="text-xs text-muted font-bengali">আপনার নাম, মোবাইল এবং বর্তমান ঠিকানা আপডেট করুন</p>
              </div>
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

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl bg-fire text-white hover:bg-fire-dark font-bold font-bengali shadow-md hover:shadow-fire/20 active:scale-95 transition-all text-base gap-2 shrink-0 cursor-pointer"
                >
                  <Save size={20} />
                  {updateProfile.isPending ? "সেভ হচ্ছে..." : "সেভ করুন"}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Password Form Card */}
          <motion.div 
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6 border-b border-border bg-cream/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-fire shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold font-bengali text-charcoal">পাসওয়ার্ড পরিবর্তন</h2>
                <p className="text-xs text-muted font-bengali">অ্যাকাউন্টের সুরক্ষার্থে নিয়মিত নতুন পাসওয়ার্ড পরিবর্তন করুন</p>
              </div>
            </div>
            
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="p-6 sm:p-8 space-y-6">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-10 text-muted-light hover:text-fire transition-colors focus:outline-none z-10 cursor-pointer"
                >
                  {showCurrentPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <FormInput
                  type={showCurrentPassword ? "text" : "password"}
                  label="বর্তমান পাসওয়ার্ড"
                  {...registerPassword("currentPassword")}
                  error={passwordErrors.currentPassword?.message}
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-10 text-muted-light hover:text-fire transition-colors focus:outline-none z-10 cursor-pointer"
                  >
                    {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <FormInput
                    type={showNewPassword ? "text" : "password"}
                    label="নতুন পাসওয়ার্ড"
                    {...registerPassword("newPassword")}
                    error={passwordErrors.newPassword?.message}
                  />
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-10 text-muted-light hover:text-fire transition-colors focus:outline-none z-10 cursor-pointer"
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <FormInput
                    type={showConfirmPassword ? "text" : "password"}
                    label="পাসওয়ার্ড নিশ্চিত করুন"
                    {...registerPassword("confirmPassword")}
                    error={passwordErrors.confirmPassword?.message}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl bg-fire text-white hover:bg-fire-dark font-bold font-bengali shadow-md hover:shadow-fire/20 active:scale-95 transition-all text-base gap-2 shrink-0 cursor-pointer"
                >
                  <Lock size={20} />
                  {changePassword.isPending ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
                </Button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
