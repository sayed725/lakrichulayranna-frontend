import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { RotateCcw, RefreshCcw, CheckCircle, AlertTriangle, Camera, Truck, Phone, Mail, FileText, Ban } from "lucide-react";

export default function TermsPage() {
  return (
    <section className="py-20 bg-cream">
      <Container>
        <div className="text-center mb-16">
          <SectionTitle
            titleBn="শর্তাবলী"
            subtitle="আমাদের রিফান্ড এবং এক্সচেঞ্জ নীতি বুঝে আরও ভালো অভিজ্ঞতা উপভোগ করুন"
            align="center"
          />
        </div>

        <div className="space-y-16">
          {/* 1. Refund Policy */}
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
              <RotateCcw className="text-fire" size={28} />
              <h2 className="text-3xl font-extrabold tracking-tight text-charcoal font-bengali">১. রিফান্ড নীতি</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-fire/10 rounded-lg text-fire shrink-0">
                    <Ban size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-charcoal font-bengali">ডেলিভারি না হলে বা অতিরিক্ত পেমেন্ট</h4>
                    <p className="text-charcoal/70 text-sm leading-relaxed font-bengali">
                      আপনি যদি অর্ডার করা পণ্যটি না পান বা কোনো কারণে আসল মূল্যের চেয়ে বেশি পেমেন্ট করে থাকেন, তবে আমরা আপনার অর্ডারের <strong className="text-fire">৭ কার্যদিবসের</strong> মধ্যে টাকা ফেরত দেব।
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-fire/10 rounded-lg text-fire shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-charcoal font-bengali">স্টক আউট পরিস্থিতি</h4>
                    <p className="text-charcoal/70 text-sm leading-relaxed font-bengali">
                      যদি কোনো প্রিপেইড আইটেম স্টক আউট হয়ে যায়, আপনি বিকল্প পণ্য বেছে নিতে পারেন বা সম্পূর্ণ রিফান্ডের অনুরোধ করতে পারেন। রিফান্ড <strong className="text-fire">৭ কার্যদিবসের</strong> মধ্যে প্রক্রিয়া করা হবে।
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-sm md:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-fire/10 rounded-lg text-fire shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-charcoal font-bengali">পণ্য কম বা ভুল পরিমাণ</h4>
                    <p className="text-charcoal/70 text-sm leading-relaxed font-bengali">
                      যদি আপনার অর্ডার অসম্পূর্ণ থাকে বা আপনি অর্ডার করা পরিমাণের চেয়ে কম পান, আমরা অনুপস্থিত আইটেমগুলি <strong className="text-fire">আমাদের নিজস্ব ডেলিভারি খরচে</strong> পাঠিয়ে দেব।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Exchange Policy */}
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
              <RefreshCcw className="text-fire" size={28} />
              <h2 className="text-3xl font-extrabold tracking-tight text-charcoal font-bengali">২. এক্সচেঞ্জ নীতি</h2>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-cream/30 rounded-2xl border border-border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-bengali text-charcoal">
                  <CheckCircle className="text-success" size={20} />
                  যোগ্যতার সময়সীমা
                </h3>
                <p className="text-charcoal/70 leading-relaxed font-bengali">
                  অফলাইন অর্ডারের জন্য ক্রয়ের তারিখ থেকে বা অনলাইন অর্ডারের জন্য প্রাপ্তির তারিখ থেকে <strong className="text-fire">এক সপ্তাহের</strong> (৭ দিন) মধ্যে পণ্যগুলি এক্সচেঞ্জের জন্য যোগ্য।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <h4 className="font-black text-fire mt-1">০১.</h4>
                    <p className="text-charcoal/70 font-bengali">অনলাইন অর্ডারের জন্য ব্যবহৃত নাম এবং মোবাইল নম্বর প্রদান করুন। অফলাইন অর্ডারের জন্য ক্রয়ের তারিখ প্রয়োজন।</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <h4 className="font-black text-fire mt-1">০২.</h4>
                    <p className="text-charcoal/70 font-bengali">এক্সচেঞ্জের কারণ স্পষ্টভাবে উল্লেখ করুন। যদি পণ্যটি ত্রুটিপূর্ণ হয়, অনুগ্রহ করে ফটো বা ভিডিও প্রদান করুন (অনলাইন অর্ডারের জন্য) বা আমাদের দোকানে নিয়ে আসুন।</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <h4 className="font-black text-fire mt-1">০৩.</h4>
                    <p className="text-charcoal/70 font-bengali"><strong className="text-charcoal">শিপিং খরচ:</strong> যদি পণ্যটিতে ত্রুটি থাকে, আমরা এক্সচেঞ্জ ডেলিভারি চার্জ বহন করি। ব্যক্তিগত পছন্দ পরিবর্তনের জন্য, গ্রাহক ডেলিভারি খরচ বহন করবেন।</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <h4 className="font-black text-fire mt-1">০৪.</h4>
                    <p className="text-charcoal/70 font-bengali">এক্সচেঞ্জ সমন্বয়: আপনি যদি নতুন পণ্য বেছে নেন, আমরা নতুন ডেলিভারির সময় আপনার এক্সচেঞ্জ আইটেমের সাথে বিল সমন্বয় করব।</p>
                  </div>
                </div>
              </div>

              <div className="bg-fire/5 p-6 rounded-2xl border-2 border-fire/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl text-fire shrink-0 shadow-sm border border-border">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold tracking-tight text-charcoal mb-2 font-bengali">গুরুত্বপূর্ণ: ডেলিভারি পরিদর্শন</h4>
                    <p className="text-charcoal/70 leading-relaxed text-sm font-medium font-bengali">
                      আপনি যদি ডেলিভারির সময় কোনো পণ্য পছন্দ না করেন, <strong className="text-fire">সরাসরি</strong> ডেলিভারি ব্যক্তির কাছে ফেরত দেবেন না, কারণ এতে পণ্য হারানোর ঝুঁকি থাকে। পরিবর্তে, বিল পরিশোধ করে পার্সেলটি গ্রহণ করুন, তারপর ৭ দিনের মধ্যে আমাদের জানান। আমরা এক্সচেঞ্জ ব্যবস্থা করব এবং বিল সমন্বয় করব, ইনশাআল্লাহ।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <section className="text-center pt-8 border-t border-border">
            <h2 className="text-2xl font-extrabold tracking-tight mb-6 font-bengali text-charcoal">সাহায্য প্রয়োজন?</h2>
            <p className="text-charcoal/70 mb-8 font-bengali">
              আমাদের দল আপনার সন্তুষ্টি নিশ্চিত করতে এখানে আছে। এই শর্তাবলী সম্পর্কে কোনো স্পষ্টতার জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-3 bg-white shadow-sm border border-border p-4 rounded-2xl">
                <Phone className="text-fire" size={20} />
                <div>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider font-bengali">কল করুন</p>
                  <p className="font-bold text-charcoal">01627142598</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white shadow-sm border border-border p-4 rounded-2xl">
                <Mail className="text-fire" size={20} />
                <div>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider font-bengali">ইমেইল করুন</p>
                  <p className="font-bold text-charcoal">abusayedkhan.pro@gmail.com</p>
                </div>
              </div>
            </div>
            <p className="mt-12 text-sm text-muted italic font-bengali">
              সর্বশেষ আপডেট: ২৪ মে, ২০২৬
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}
