"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container/Container";
import { FormInput } from "@/components/forms/FormInput";
import { Logo } from "@/components/shared/logo/Logo";
import { useLogin } from "@/features/auth/hooks/useLogin";

const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || undefined;
  const login = useLogin(callbackUrl);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <div className="bg-white py-10 px-6 sm:px-10 rounded-3xl shadow-xl shadow-fire/5 border border-border">
          <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
            <Logo size="md" />
            <h2 className="mt-6 text-center text-2xl font-bold font-bengali text-charcoal">
              ফিরে আসার জন্য স্বাগতম
            </h2>
            <p className="mt-2 text-center text-sm font-bengali text-muted">
              আপনার অ্যাকাউন্টে লগইন করুন
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Mail size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="ইমেইল অ্যাড্রেস"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute right-4 top-10 text-muted-light" />
              <FormInput
                label="পাসওয়ার্ড"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-fire focus:ring-fire border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-bengali text-charcoal">
                  মনে রাখুন
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-bengali font-semibold text-fire hover:text-fire-dark">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold font-bengali text-white bg-fire hover:bg-fire-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fire transition-colors disabled:opacity-50"
            >
              {login.isPending ? "লগইন হচ্ছে..." : "লগইন করুন"}
              {!login.isPending && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm font-bengali text-muted">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/register" className="font-bold text-fire hover:text-fire-dark transition-colors">
                রেজিস্টার করুন
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
