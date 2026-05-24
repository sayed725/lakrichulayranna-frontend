import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { Shield, Mail, Phone, Clock, UserCheck, Share2, MousePointer2, FileEdit, Eye, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <section className="py-20 bg-cream">
      <Container>
        <div className="text-center mb-16">
          <SectionTitle
            titleBn="গোপনীয়তা নীতি"
            subtitle="আমরা কিভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি"
            align="center"
          />
        </div>

        <div className="mb-12 text-lg text-charcoal/70 leading-relaxed font-bengali">
          <p>
            এই গোপনীয়তা নীতিটি ব্যাখ্যা করে যে আমরা, <strong className="text-fire">লাকড়ি চুলায়রান্না</strong>, কিভাবে আমাদের ওয়েবসাইটের মাধ্যমে আপনার (গ্রাহকের) তথ্য সংগ্রহ, ব্যবহার এবং সংরক্ষণ করি। আমরা আপনার গোপনীয়তা রক্ষার প্রতিশ্রুতি দিই এবং নিশ্চিত করি যে আপনার ব্যক্তিগত তথ্য নিরাপদ এবং দায়িত্বশীলভাবে পরিচালিত হবে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fire/10 rounded-lg text-fire">
                <UserCheck size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight font-bengali text-charcoal">তথ্য যা আমরা সংগ্রহ করি</h3>
            </div>
            <ul className="space-y-3 text-charcoal/70 font-bengali">
              <li className="flex items-start gap-2">
                <span className="text-fire mt-1">•</span>
                <div><strong className="text-charcoal">যোগাযোগের বিবরণ:</strong> ইমেইল ঠিকানা, শিপিং ঠিকানা এবং ফোন নম্বর।</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fire mt-1">•</span>
                <div><strong className="text-charcoal">পেমেন্টের বিবরণ:</strong> আপনার লেনদেন নিরাপদভাবে প্রক্রিয়া করার জন্য প্রয়োজনীয় তথ্য।</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fire mt-1">•</span>
                <div><strong className="text-charcoal">পছন্দসমূহ:</strong> আপনার কেনাকাটার আগ্রহ এবং পছন্দের আইটেম।</div>
              </li>
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fire/10 rounded-lg text-fire">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight font-bengali text-charcoal">কখন আমরা সংগ্রহ করি</h3>
            </div>
            <p className="text-charcoal/70 mb-4 font-bengali">আমরা নিম্নলিখিত মিথস্ক্রিয়াগুলির সময় আপনার তথ্য সংগ্রহ করি:</p>
            <ul className="space-y-2 text-charcoal/70 font-bengali">
              <li className="flex items-center gap-2">
                <span className="text-fire">•</span>
                <span>যখন আপনি আমাদের সাইট থেকে কিছু কিনেন।</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-fire">•</span>
                <span>যখন আপনি আমাদের প্ল্যাটফর্মে একটি অ্যাকাউন্ট তৈরি করেন।</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-fire">•</span>
                <span>যখন আপনি আমাদের নিউজলেটারে সাবস্ক্রাইব করেন।</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-fire">•</span>
                <span>যখন আপনি আমাদের কাস্টমার সাপোর্টে যোগাযোগ করেন।</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-fire">•</span>
                <span>কুকিজ এবং অনুরূপ প্রযুক্তির মাধ্যমে।</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
              <MousePointer2 className="text-fire" size={24} />
              <h2 className="text-2xl font-extrabold tracking-tight font-bengali text-charcoal">আমরা কিভাবে আপনার তথ্য ব্যবহার করি</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "অর্ডার প্রক্রিয়াকরণ", desc: "আপনার অর্ডার, পেমেন্ট এবং ডেলিভারি দক্ষতার সাথে প্রক্রিয়া করার জন্য।" },
                { title: "কেনাকাটার অভিজ্ঞতা", desc: "আমাদের সাইটে আপনার কেনাকাটার যাত্রা উন্নত এবং ব্যক্তিগতকরণের জন্য।" },
                { title: "সেবা উন্নতি", desc: "আমাদের পণ্য এবং কাস্টমার সেবা ক্রমাগতভাবে উন্নত করার জন্য।" },
                { title: "মার্কেটিং", desc: "ইমেইল, এসএমএস বা কলের মাধ্যমে নতুন আইটেম এবং অফার সম্পর্কে আপনাকে জানানোর জন্য।" },
                { title: "যোগাযোগ", desc: "অর্ডার, অনুসন্ধান বা অ্যাকাউন্ট আপডেট সম্পর্কে আপনার সাথে যোগাযোগ করার জন্য।" }
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl border border-border hover:border-fire/50 transition-colors bg-cream/30">
                  <h4 className="font-bold mb-2 text-fire font-bengali">{item.title}</h4>
                  <p className="text-sm text-charcoal/70 font-bengali">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
              <Share2 className="text-fire" size={24} />
              <h2 className="text-2xl font-extrabold tracking-tight font-bengali text-charcoal">তথ্য ভাগাভাগি</h2>
            </div>
            <p className="text-charcoal/70 mb-6 leading-relaxed font-bengali">
              আমরা আপনার গোপনীয়তার সম্মান করি এবং শুধুমাত্র অপরিহার্য সেবার জন্য বিশ্বস্ত অংশীদারদের সাথে আপনার তথ্য ভাগ করি:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex gap-3 bg-cream/30 p-4 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-fire mt-2 shrink-0"></div>
                <span className="text-charcoal/70 font-bengali">লজিস্টিকস, পেমেন্ট এবং অর্ডার পূরণ পরিচালনা করে এমন সেবা প্রদানকারী।</span>
              </li>
              <li className="flex gap-3 bg-cream/30 p-4 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-fire mt-2 shrink-0"></div>
                <span className="text-charcoal/70 font-bengali">আমাদের মার্কেটিং এবং প্রমোশনাল কার্যকলাপে নিয়োজিত তৃতীয় পক্ষ।</span>
              </li>
              <li className="flex gap-3 bg-cream/30 p-4 rounded-lg col-span-full">
                <div className="h-2 w-2 rounded-full bg-fire mt-2 shrink-0"></div>
                <span className="text-charcoal/70 font-bengali">আইন প্রয়োগকারী বা সরকারী প্রতিষ্ঠান, শুধুমাত্র আইন দ্বারা কঠোরভাবে প্রয়োজন হলে।</span>
              </li>
            </ul>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                <Shield className="text-fire" size={24} />
                <h2 className="text-2xl font-extrabold tracking-tight font-bengali text-charcoal">নিরাপত্তা</h2>
              </div>
              <p className="text-charcoal/70 leading-relaxed font-bengali">
                আমরা নিশ্চিত করার জন্য উপযুক্ত প্রযুক্তিগত এবং সাংগঠনিক ব্যবস্থা গ্রহণ করেছি যে আপনার তথ্য সুরক্ষিত থাকবে। তবে মনে রাখবেন যে ইন্টারনেটের মাধ্যমে কোনো প্রেরণ পদ্ধতি ১০০% নিরাপদ নয়, এবং আমরা পরম নিরাপত্তা নিশ্চিত করতে পারি না।
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                <Eye className="text-fire" size={24} />
                <h2 className="text-2xl font-extrabold tracking-tight font-bengali text-charcoal">আপনার অধিকার</h2>
              </div>
              <ul className="space-y-3 text-charcoal/70 font-bengali">
                <li className="flex items-center gap-2">
                  <Lock size={16} className="text-fire" />
                  <span>আপনার তথ্য দেখতে, পরিবর্তন করতে বা মুছে ফেলার অনুরোধ করার অধিকার।</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock size={16} className="text-fire" />
                  <span>আপনার তথ্য প্রক্রিয়াকরণের বিরোধিতা করার অধিকার।</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock size={16} className="text-fire" />
                  <span>প্রমোশনাল ইমেইল, এসএমএস বা ফোন কল থেকে বেরিয়ে যাওয়ার অধিকার।</span>
                </li>
              </ul>
            </section>
          </div>

          <section className="bg-fire/5 p-8 rounded-3xl border border-fire/10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <MousePointer2 className="text-fire" size={24} />
                  <h2 className="text-2xl font-extrabold tracking-tight text-charcoal font-bengali">কুকিজ</h2>
                </div>
                <p className="text-charcoal/70 mb-6 font-medium font-bengali">
                  আমাদের ওয়েবসাইট আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে এবং আমাদের ট্রাফিক বিশ্লেষণ করতে কুকিজ এবং অনুরূপ প্রযুক্তি ব্যবহার করে। আপনি যেকোনো সময় আপনার ব্রাউজার সেটিংসের মাধ্যমে আপনার কুকি পছন্দ পরিচালনা করতে পারেন।
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <FileEdit className="text-fire" size={24} />
                  <h2 className="text-2xl font-extrabold tracking-tight text-charcoal font-bengali">নীতি পরিবর্তন</h2>
                </div>
                <p className="text-charcoal/70 font-medium font-bengali">
                  আমরা প্রয়োজন অনুযায়ী এই গোপনীয়তা নীতি পরিবর্তন করার অধিকার সংরক্ষণ করি। কোনো পরিবর্তন এই পৃষ্ঠায় প্রকাশিত হওয়ার সাথে সাথেই কার্যকর হবে।
                </p>
              </div>
            </div>
          </section>

          <section className="text-center pt-8 border-t border-border">
            <h2 className="text-2xl font-extrabold tracking-tight mb-6 font-bengali text-charcoal">আমাদের সাথে যোগাযোগ করুন</h2>
            <p className="text-charcoal/70 mb-8 font-bengali">
              এই নীতি বা আপনার ব্যক্তিগত তথ্য সম্পর্কে আপনার কোনো প্রশ্ন, উদ্বেগ বা পরামর্শ থাকলে, অনুগ্রহ করে যোগাযোগ করুন:
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
