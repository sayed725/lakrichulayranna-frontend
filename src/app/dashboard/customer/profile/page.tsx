"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Save, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Mail, 
  Sparkles, 
  KeyRound, 
  Camera,
  Check,
  UserCheck,
  BadgeCheck
} from "lucide-react";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useUpdateProfile, useChangePassword } from "@/features/user/hooks/useUpdateProfile";
import { motion, AnimatePresence } from "framer-motion";
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
  
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
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

  // Helper to extract initials
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-8 sm:pb-12 max-w-[1400px] mx-auto px-1 sm:px-2">
      {/* Premium Profile Cover Header */}
      <motion.div 
        {...fadeInUp}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 shadow-sm"
      >
        {/* Banner Graphic Background */}
        <div className="h-24 sm:h-32 md:h-36 bg-gradient-to-r from-charcoal via-charcoal-light to-charcoal-dark dark:from-black dark:via-charcoal dark:to-charcoal-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fire/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="absolute top-3 sm:top-4 right-3 sm:right-6 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-black/40 backdrop-blur-md text-amber-300 border border-amber-400/30 font-bengali shadow-sm">
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400" /> ভেরিফাইড কাস্টমার
            </span>
          </div>
        </div>

        {/* User Avatar & Name Bar */}
        <div className="px-4 sm:px-6 lg:px-8 pb-5 pt-2 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-4 -mt-10 sm:-mt-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-3 sm:gap-4 text-center md:text-left min-w-0 w-full md:w-auto">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-fire via-amber-500 to-terracotta p-1 shadow-lg shadow-fire/20">
                <div className="w-full h-full rounded-[14px] sm:rounded-[22px] bg-charcoal flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-fire font-latin select-none">
                  {getInitials(user?.name || "")}
                </div>
              </div>
            </div>

            <div className="md:pb-1 pt-1 md:pt-0 space-y-1.5 min-w-0">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold font-bengali text-charcoal dark:text-cream tracking-tight truncate">
                  {user?.name || "সম্মানিত গ্রাহক"}
                </h1>
              </div>
              <div className="text-xs sm:text-sm font-bengali flex flex-col sm:flex-row items-center justify-center md:justify-start gap-1.5 sm:gap-3 text-muted dark:text-cream/70 max-w-full overflow-hidden">
                <span className="font-latin font-medium text-charcoal/80 dark:text-cream/90 shrink-0">{user?.phone || "নম্বর পাওয়া যায়নি"}</span>
                {user?.email && (
                  <div className="flex items-center gap-1.5 max-w-full min-w-0">
                    <span className="hidden sm:inline text-muted/40 font-latin shrink-0">•</span>
                    <span 
                      className="font-latin font-semibold text-fire dark:text-amber-400 bg-fire/5 dark:bg-white/5 px-2 py-0.5 rounded border border-fire/10 dark:border-white/10 truncate max-w-[200px] xs:max-w-[260px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[360px]"
                      title={user.email}
                    >
                      {user.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-cream-dark/60 dark:bg-white/5 rounded-xl border border-border/60 dark:border-white/10 w-full md:w-auto shrink-0 mt-1 md:mt-0">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 md:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold font-bengali transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-white dark:bg-charcoal text-fire shadow-sm border border-fire/20"
                  : "text-muted dark:text-cream/70 hover:text-charcoal dark:hover:text-cream"
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>ব্যক্তিগত তথ্য</span>
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 md:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold font-bengali transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === "password"
                  ? "bg-white dark:bg-charcoal text-fire shadow-sm border border-fire/20"
                  : "text-muted dark:text-cream/70 hover:text-charcoal dark:hover:text-cream"
              }`}
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>
                <span className="inline xl:hidden">পাসওয়ার্ড</span>
                <span className="hidden xl:inline">পাসওয়ার্ড পরিবর্তন</span>
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" ? (
          <motion.div
            key="profile-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6"
          >
            {/* Form Section */}
            <div className="lg:col-span-8 bg-white dark:bg-charcoal rounded-2xl sm:rounded-3xl border border-border/80 dark:border-white/10 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-border/60 dark:border-white/5 pb-4">
                <div className="w-10 h-10 rounded-xl bg-fire/10 text-fire flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-bengali text-charcoal dark:text-cream">ব্যক্তিগত প্রোফাইল এডিট</h2>
                  <p className="text-xs text-muted dark:text-cream/60 font-bengali">অর্ডার গ্রহণের জন্য আপনার সঠিক তথ্য দিয়ে রাখুন</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <FormInput
                      label="আপনার নাম"
                      placeholder="যেমন: মোঃ সাকিব হোসেন"
                      {...registerProfile("name")}
                      error={profileErrors.name?.message}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <FormInput
                      label="মোবাইল নম্বর"
                      placeholder="01XXXXXXXXX"
                      {...registerProfile("phone")}
                      error={profileErrors.phone?.message}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <FormTextarea
                    label="সম্পূর্ণ ডেলিভারি ঠিকানা"
                    placeholder="বাসা/ফ্ল্যাট নম্বর, রোড, এলাকা, জেলা..."
                    {...registerProfile("address")}
                    error={profileErrors.address?.message}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-fire hover:bg-fire-dark text-white font-bold font-bengali text-xs sm:text-sm gap-2 shadow-md shadow-fire/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {updateProfile.isPending ? "সেভ হচ্ছে..." : "তথ্য পরিবর্তন সেভ করুন"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Side Overview Cards */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-5">
              <div className="bg-gradient-to-br from-amber-500/10 via-fire/5 to-transparent border border-fire/15 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-fire" /> প্রোফাইল তথ্য ব্যবহারের নিয়ম
                </h3>
                <p className="text-xs text-muted dark:text-cream/70 font-bengali leading-relaxed">
                  আপনার দেওয়া ঠিকানা এবং ফোন নম্বর ব্যবহার করে রাইডার আপনার সাথে দ্রুত যোগাযোগ করতে পারবেন।
                </p>
              </div>

              <div className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold font-bengali text-muted dark:text-cream/50 uppercase tracking-wider">অ্যাকাউন্ট স্ট্যাটাস</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bengali">
                    <span className="text-muted dark:text-cream/70">অ্যাকাউন্টের ধরণ:</span>
                    <span className="font-bold text-fire bg-fire/10 px-2 py-0.5 rounded-full">গ্রাহক (Customer)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bengali pt-1">
                    <span className="text-muted dark:text-cream/70">স্ট্যাটাস:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> সক্রিয়
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="password-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6"
          >
            {/* Password Form Section */}
            <div className="lg:col-span-8 bg-white dark:bg-charcoal rounded-2xl sm:rounded-3xl border border-border/80 dark:border-white/10 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-border/60 dark:border-white/5 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-bengali text-charcoal dark:text-cream">নতুন পাসওয়ার্ড সেট করুন</h2>
                  <p className="text-xs text-muted dark:text-cream/60 font-bengali">আপনার পূর্ববর্তী পাসওয়ার্ড নিশ্চিত করে নতুন পাসওয়ার্ড দিন</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-10 text-muted hover:text-fire transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <FormInput
                    type={showCurrentPassword ? "text" : "password"}
                    label="বর্তমান পাসওয়ার্ড"
                    placeholder="বর্তমান পাসওয়ার্ড প্রবেশ করুন"
                    {...registerPassword("currentPassword")}
                    error={passwordErrors.currentPassword?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-10 text-muted hover:text-fire transition-colors cursor-pointer"
                    >
                      {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <FormInput
                      type={showNewPassword ? "text" : "password"}
                      label="নতুন পাসওয়ার্ড"
                      placeholder="কমপক্ষে ৬টি অক্ষর"
                      {...registerPassword("newPassword")}
                      error={passwordErrors.newPassword?.message}
                    />
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-10 text-muted hover:text-fire transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <FormInput
                      type={showConfirmPassword ? "text" : "password"}
                      label="পাসওয়ার্ড পুনরায় দিন"
                      placeholder="পুনরায় নিশ্চিত করুন"
                      {...registerPassword("confirmPassword")}
                      error={passwordErrors.confirmPassword?.message}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-fire hover:bg-fire-dark text-white font-bold font-bengali text-xs sm:text-sm gap-2 shadow-md shadow-fire/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    {changePassword.isPending ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Side Security Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-charcoal border border-border/80 dark:border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold font-bengali text-charcoal dark:text-cream flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> পাসওয়ার্ড টিপস
                </h4>
                <ul className="space-y-2 text-xs text-muted dark:text-cream/70 font-bengali leading-relaxed">
                  <li>• সংখ্যা ও অক্ষর মিলিয়ে পাসওয়ার্ড দিলে অ্যাকাউন্ট আরও নিরাপদ থাকে।</li>
                  <li>• কোনো অবস্থাতেই আপনার পাসওয়ার্ড অন্যের সাথে শেয়ার করবেন না।</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
