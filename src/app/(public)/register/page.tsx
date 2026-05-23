"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container/Container";
import { FormInput } from "@/components/forms/FormInput";
import { Logo } from "@/components/shared/logo/Logo";
import { useRegister } from "@/features/auth/hooks/useRegister";

const registerSchema = z.object({
  name: z.string().min(3, "নাম কমপক্ষে ৩ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  phone: z.string().regex(/^(01)[3-9][0-9]{8}$/, "সঠিক বাংলাদেশী মোবাইল নম্বর দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    // Exclude confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;
    registerUser.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <div className="bg-white py-10 px-6 sm:px-10 rounded-3xl shadow-xl shadow-fire/5 border border-border">
          <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
            <Logo size="md" />
            <h2 className="mt-6 text-center text-2xl font-bold font-bengali text-charcoal">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </h2>
            <p className="mt-2 text-center text-sm font-bengali text-muted">
              লাকড়ি চুলায় রান্নায় আপনাকে স্বাগতম
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <User size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="সম্পূর্ণ নাম *"
                type="text"
                placeholder="আপনার নাম"
                {...register("name")}
                error={errors.name?.message}
              />
            </div>

            <div className="relative">
              <Mail size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="ইমেইল অ্যাড্রেস *"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <div className="relative">
              <Phone size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="মোবাইল নম্বর *"
                type="tel"
                placeholder="01XXXXXXXXX"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="পাসওয়ার্ড *"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="পাসওয়ার্ড নিশ্চিত করুন *"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </div>

            <button
              type="submit"
              disabled={registerUser.isPending}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold font-bengali text-white bg-fire hover:bg-fire-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fire transition-colors disabled:opacity-50 mt-2"
            >
              {registerUser.isPending ? "রেজিস্টার হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
              {!registerUser.isPending && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm font-bengali text-muted">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/login" className="font-bold text-fire hover:text-fire-dark transition-colors">
                লগইন করুন
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
