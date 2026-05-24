import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { Truck, Calendar, MapPin, Gift, AlertTriangle, RotateCcw, Phone, Mail, Clock, Zap } from "lucide-react";

export default function ShippingPage() {
  return (
    <section className="py-20 bg-cream">
      <Container>
        <div className="text-center mb-16">
          <SectionTitle
            titleBn="শিপিং নীতি"
            subtitle="আপনার স্ন্যাকস আপনার দরজায় পৌঁছানোর যাত্রা আমরা কিভাবে পরিচালনা করি"
            align="center"
          />
        </div>

        <div className="mb-12 text-lg text-charcoal/70 leading-relaxed font-bengali">
          <p>
            <strong className="text-fire">লাকড়ি চুলায়রান্না</strong> আপনার স্ন্যাকস যাত্রার সঙ্গী হিসেবে বেছে নেওয়ার জন্য ধন্যবাদ। এই শিপিং নীতি আপনাকে আপনার অর্ডার করা পণ্যের ডেলিভারি নিয়ম ও প্রবিধান সম্পর্কে অবহিত করে। আমাদের ই-কমার্স ওয়েবসাইটের মাধ্যমে অর্ডার দেওয়ার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fire/10 rounded-lg text-fire">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight font-bengali text-charcoal">প্রক্রিয়াকরণ সময়</h3>
            </div>
            <p className="text-charcoal/70 leading-relaxed font-bengali">
              স্টক প্রাপ্যতার উপর নির্ভর করে, অর্ডারগুলি সাধারণত নিশ্চিতকরণের <strong className="text-fire">এক থেকে দুই কার্যদিবসের</strong> মধ্যে প্রস্তুত করা হয় এবং আমাদের ডেলিভারি পার্টনারদের কাছে হস্তান্তর করা হয়। এই প্রক্রিয়াকরণ সময় শুরু হয় যখন আমরা ফোন কলের মাধ্যমে আপনার অর্ডার নিশ্চিত করি।
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fire/10 rounded-lg text-fire">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight font-bengali text-charcoal">ডেলিভারি পার্টনার</h3>
            </div>
            <p className="text-charcoal/70 leading-relaxed font-bengali">
              আমরা <strong className="text-fire">পাঠাও কুরিয়ার</strong> এবং <strong className="text-fire">সুন্দরবন কুরিয়ার</strong> এর মতো নির্ভরযোগ্য তৃতীয় পক্ষের সেবা ব্যবহার করি। বাংলাদেশ জুড়ে ডেলিভারি সাধারণত নিশ্চিতকরণের পরে <strong className="text-fire">১ থেকে ৪ দিনের</strong> মধ্যে সম্পন্ন হয়।
            </p>
            <p className="text-xs text-charcoal/70 mt-2 italic font-bengali">
              *সুন্দরবন কুরিয়ারের জন্য, গ্রাহকদের তাদের সংশ্লিষ্ট শাখা অফিস থেকে পার্সেল সংগ্রহ করতে হতে পারে।
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section className="bg-fire/5 p-8 rounded-3xl border border-fire/10">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-fire" size={24} />
              <h2 className="text-2xl font-extrabold tracking-tight text-charcoal font-bengali">জরুরি একই দিনের ডেলিভারি</h2>
            </div>
            <div className="text-charcoal/70 space-y-4 font-medium font-bengali">
              <p>
                আমরা <strong className="text-fire">ঢাকা এবং চট্টগ্রাম</strong> শহরের জন্য জরুরি একই দিনের ডেলিভারি সেবা প্রদান করি। এই সেবা ম্যানুয়ালি পরিচালিত হয়:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>প্রক্রিয়া: অর্ডারগুলি ম্যানুয়ালি দেওয়া/নিশ্চিত করতে হবে।</li>
                <li>পেমেন্ট: মোট অর্ডার মূল্য অগ্রিমে <strong className="text-fire">বিকাশ, রকেট, বা নগদ</strong> এর মাধ্যমে পরিশোধ করতে হবে।</li>
                <li>চার্জ: গ্রাহক ডেলিভারির সময় সরাসরি রাইডারের কাছে জরুরি ডেলিভারি ফি প্রদান করবেন (ফি দূরত্বের উপর নির্ভর করে যা পাঠাও বা বুকিং অ্যাপ দ্বারা গণনা করা হয়)।</li>
              </ul>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                <MapPin className="text-fire" size={24} />
                <h2 className="text-2xl font-extrabold tracking-tight font-bengali text-charcoal">ঠিকানার নির্ভুলতা</h2>
              </div>
              <p className="text-charcoal/70 leading-relaxed font-bengali">
                সঠিক এবং সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করা গ্রাহকের দায়িত্ব। <strong className="text-fire">লাকড়ি চুলায়রান্না</strong> গ্রাহক দ্বারা প্রদত্ত ভুল ঠিকানা বা যোগাযোগের বিবরণের কারণে ডেলিভারি ব্যর্থতা বা ভুল ডেলিভারির জন্য দায়ী থাকবে না।
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                <Gift className="text-fire" size={24} />
                <h2 className="text-2xl font-extrabold tracking-tight font-bengali text-charcoal">উপহার এবং তৃতীয় পক্ষের সংগ্রহ</h2>
              </div>
              <p className="text-charcoal/70 leading-relaxed font-bengali">
                আপনি যদি কাউকে উপহার পাঠাচ্ছেন বা অন্য কেউ অর্ডারটি গ্রহণ করছেন, অনুগ্রহ করে আগে থেকে গ্রহীতাকে জানান। যদি পার্সেল গ্রহণকারী আমাদের যাচাইকরণ কলের সময় অর্ডার নিশ্চিত না করেন, অর্ডারটি বাতিল হিসেবে চিহ্নিত করা হবে।
              </p>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                <AlertTriangle className="text-fire" size={24} />
                <h2 className="text-2xl font-extrabold tracking-tight font-bengali text-charcoal">সম্ভাব্য দেরি</h2>
              </div>
              <p className="text-charcoal/70 leading-relaxed font-bengali">
                আমরা গতিতে মনোযোগ দিই, তবে চরম আবহাওয়া, কুরিয়ার সেবা সমস্যা, রাজনৈতিক ইভেন্ট বা অন্যান্য অপ্রত্যাশিত ঘটনার মতো অনিবার্য পরিস্থিতির কারণে দেরি হতে পারে। এই ধরনের ক্ষেত্রে আপনার ধৈর্য এবং সহযোগের জন্য আমরা কৃতজ্ঞ।
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-2">
                <RotateCcw className="text-fire" size={24} />
                <h2 className="text-2xl font-extrabold tracking-tight font-bengali text-charcoal">রিটার্ন এবং পুনঃডেলিভারি</h2>
              </div>
              <p className="text-charcoal/70 leading-relaxed font-bengali">
                ভুল ঠিকানার কারণে বা গ্রাহক ৩টি ধারাবাহিক ডেলিভারি প্রচেষ্টায় উপলব্ধ না থাকার কারণে পার্সেল ফেরত পাঠানো হলে, গ্রাহক প্রাথমিক শিপিং ফি এবং রিটার্ন শিপিং চার্জ উভয়ই বহন করবেন।
              </p>
            </section>
          </div>

          <section className="text-center pt-8 border-t border-border">
            <h2 className="text-2xl font-extrabold tracking-tight mb-6 font-bengali text-charcoal">আমাদের সাথে যোগাযোগ করুন</h2>
            <p className="text-charcoal/70 mb-8 font-bengali">
              আপনার চালানি সম্পর্কে কোনো প্রশ্ন বা উদ্বেগ থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:
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
