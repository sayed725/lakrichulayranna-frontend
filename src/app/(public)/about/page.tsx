"use client";

import { motion, Variants } from "framer-motion";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import { 
  Utensils, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  DollarSign, 
  ChefHat, 
  Leaf, 
  Flame,
  FileText
} from "lucide-react";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const sisterBrands = [
    {
      year: "২০২২",
      name: "খাঁটি খামার",
      desc: "দেশের অন্যতম সেরা অর্গানিক ও ফ্রেশ ইনগ্রেডিয়েন্টস সরবরাহকারী প্রতিষ্ঠান। আমাদের রান্নায় ব্যবহৃত সকল মূল উপাদান এখান থেকেই সংগৃহীত হয়।",
      icon: <Leaf className="w-6 h-6 text-emerald-500" />,
      color: "border-emerald-500/20 bg-emerald-50/50"
    },
    {
      year: "২০২৪",
      name: "মশলা বাড়ি",
      desc: "বাংলাদেশে সম্পূর্ণ প্রিজারভেটিভ-মুক্ত এবং হাতে ভাঙা খাঁটি মসলা নিয়ে ফোকাসড প্রথম বাংলাদেশি ব্র্যান্ড। আমাদের নিজস্ব রন্ধনশালার মসলার জোগান আসে এখান থেকে।",
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      color: "border-amber-500/20 bg-amber-50/50"
    },
    {
      year: "২০২৬",
      name: "লাকড়ি চুলায় রান্না",
      desc: "কাঠের চুলার আসল ঐতিহ্যবাহী স্বাদ এবং খাঁটি বাঙালির স্মৃতিকাতর রান্না ঘরের দোরগোড়ায় পৌঁছে দেওয়ার স্বপ্নের ভেঞ্চার, যা শুরু হয় মে ২০২৬ থেকে।",
      icon: <Flame className="w-6 h-6 text-fire" />,
      color: "border-fire/20 bg-fire-light/10"
    }
  ];

  const problems = [
    {
      num: "১",
      title: "আবহাওয়া ও স্বাদের অমিল",
      desc: "সাধারণত যেসকল রেস্টুরেন্ট বা ক্যাটারিং সার্ভিস আছে, তাদের বেশিরভাগই ওয়েস্টার্ন বা বিদেশি রান্নার ধাঁচে তৈরি, অথবা আধুনিক গ্যাসের চুলায় কৃত্রিম স্বাদ দিয়ে তৈরি। তা তো আমাদের মাটির চুলার রান্নার আবেগ আর স্বাদের সাথে মিলার কথা না! চড়া দামের স্পাইসি খাবার খেলেও মানুষ আসলে মায়ের হাতের রান্নার সেই হালকা কিন্তু সারাদিন তৃপ্ত রাখা স্বাদটিই খোঁজে। যা হাতের কাছে না পেয়ে মানুষ আধুনিক ও কৃত্রিম খাবারের প্রতি উদাসীন হতে শুরু করেছিল।",
      icon: <Utensils className="w-8 h-8 text-fire" />
    },
    {
      num: "২",
      title: "অতিরিক্ত দাম",
      desc: "আজো ভালো কোনো ক্যটারিং বা ঐতিহ্যবাহী খাবার অর্ডার করতে গেলে পকেট থেকে অনেক টাকা চলে যায় অনায়েসেই। মধ্যবিত্ত পরিবারের কাছে খাবার খাওয়াটা যেখানে আনন্দের হওয়া উচিত, সেখানে এমন চড়া মূল্যের জন্য অনেকে ইচ্ছে থাকা সত্ত্বেও আসল ঐতিহ্যবাহী স্বাদ থেকে দূরেই থাকত। আমরা চেয়েছি পুষ্টিকর ও ঐতিহ্যবাহী খাবার সবার ক্রয়ক্ষমতার মধ্যে আসুক।",
      icon: <DollarSign className="w-8 h-8 text-terracotta" />
    },
    {
      num: "৩",
      title: "স্বাস্থ্য ও বিশুদ্ধতার অভাব",
      desc: "অধিকাংশ কমার্শিয়াল কিচেনে ব্যবহৃত ক্ষতিকর প্রিজারভেটিভ, টেস্টিং সল্ট, এবং অস্বাস্থ্যকর রি-ইউজড তেল ভোজনরসিকদের মনে গভীর ভীতি ও নামাজী মানুষদের অবচেতন মনে অপরিচ্ছন্নতার সংশয় তৈরি করত। খাবারের বিশুদ্ধতা ও পবিত্রতা নিশ্চিত করা ছিল একটি বড় শূন্যস্থান।",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />
    }
  ];

  return (
    <div className="bg-cream min-h-screen py-10 overflow-hidden font-bengali">
      {/* 1. Hero Title Section */}
      <Container className="mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <SectionTitle 
            titleBn="আমাদের সম্পর্কে" 
            subtitle="আসল কাঠের চুলার স্বাদ আর মাটির সোঁদা গন্ধের ঐতিহ্যবাহী আখ্যান" 
          />
        </motion.div>
      </Container>

      {/* 2. Founder / CEO Greeting */}
      <Container className="mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Founder Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group w-full max-w-sm">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-fire via-terracotta to-fire opacity-70 blur-lg transition duration-1000 group-hover:opacity-100 group-hover:duration-200 animate-tilt"></div>
              <div className="relative bg-charcoal text-cream p-8 rounded-2xl border border-charcoal-light flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fire to-terracotta flex items-center justify-center mb-6 shadow-inner">
                  <ChefHat className="w-12 h-12 text-cream" />
                </div>
                <h3 className="text-2xl font-bold text-cream mb-1">আবু সাঈদ খান</h3>
                <p className="text-fire-light text-sm font-semibold uppercase tracking-wider mb-4 font-latin">Founder & CEO</p>
                <div className="w-full h-px bg-cream/10 my-4" />
                <p className="text-cream/70 text-xs leading-relaxed">
                  "খাঁটি দেশীয় ঐতিহ্য আর মাটির চুলার রান্নার প্রতি ভালোবাসা থেকেই এই উদ্যোগ। আমরা শুধু খাবার পরিবেশন করি না, আমরা স্মৃতির দুয়ার খুলে দেই।"
                </p>
                {/* <div className="mt-6 flex items-center gap-2 text-xs bg-charcoal-light/50 px-4 py-2 rounded-full border border-cream/5">
                  <FileText className="w-4 h-4 text-fire" />
                  <span>ট্রেড লাইসেন্স: TRAD/DSCC/482910/2026</span>
                </div> */}
              </div>
            </div>
          </motion.div>

          {/* Right: Message Detail */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-charcoal"
          >
            <h3 className="text-3xl font-extrabold text-charcoal-light leading-tight">
              আসসালামু আলাইকুম। আবু সাঈদ খান বলছি—
            </h3>
            <p className="text-lg leading-relaxed text-charcoal/90">
              লাকড়ি চুলায় রান্নার <strong className="text-fire font-bold">"ফাউন্ডার এন্ড সিইও"</strong> পদে আসীন আছি সেই প্রথমদিন থেকে ১লা মে ২০২৬ সাল ছিল যেই দিন-টা! কাঠের চুলার আসল রান্না আর মাটির চুলার চমৎকার গন্ধের অনুভূতি ভোজনরসিকদের মুখে তুলে দিতেই আমাদের যাত্রা শুরু হয়েছিল। ঢাকার নবাবগঞ্জ এর ঐতিহ্য ও ভালোবাসাকে সাথে নিয়ে পরম করুণাময় আল্লাহর অশেষ অনুগ্রহে আমরা আমাদের সেবাকে অনলাইনের মাধ্যমে আপামর বাঙালির দোরগোড়ায় পৌঁছে দিতে পেরেছি। 
            </p>
            {/* <p className="text-base leading-relaxed text-charcoal/80">
              আমাদের ব্যবসার স্বচ্ছতা নিশ্চিত করতে আমাদের ট্রেড লাইসেন্স নাম্বারটা জানিয়ে রাখি, যেকোনো সময় আমাদের ব্যাপারে যাচাই করে নিতে পারবেন ঢাকা দক্ষিণ সিটি কর্পোরেশন থেকেঃ <span className="font-latin text-fire font-semibold">TRAD/DSCC/482910/2026</span>। 
            </p> */}
            <div className="p-4 bg-cream-dark/40 rounded-xl border-l-4 border-fire">
              <p className="text-sm italic leading-relaxed text-charcoal/90 font-medium">
                আমাদের প্রতিটি খাবারে মেশানো থাকে গ্রামীণ ঐতিহ্যের ছোঁয়া। কাঠের ধীর জ্বাল, খাঁটি তেল-মসলা এবং মাটির হাঁড়ির রান্নার অসাধারণ রসায়ন প্রতিটি লোকমাকে করে তোলে পরম তৃপ্তিদায়ক।
              </p>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* 3. Sister Brands Timeline */}
      {/* <div className="bg-charcoal text-cream py-20 mb-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,36,0.1),transparent)] pointer-events-none" />
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-bengali text-cream mb-2">আমাদের সহযোগী উদ্যোগসমূহ</h2>
            <p className="text-fire-light text-sm uppercase tracking-widest font-latin">Sister Brands & Journey</p>
            <div className="w-12 h-1 bg-fire mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sisterBrands.map((brand, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${brand.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-bold bg-cream/10 text-cream px-3 py-1 rounded-full font-latin">{brand.year}</span>
                    <div className="p-3 bg-cream/5 rounded-xl">{brand.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-cream mb-3">{brand.name}</h3>
                  <p className="text-cream/70 text-sm leading-relaxed">{brand.desc}</p>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cream/20 to-transparent mt-6" />
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="text-cream/80 text-base leading-relaxed">
              "আমরা ২০২২ সাল থেকে শুরু করে প্রতিটি পদক্ষেপে দেশীয় পণ্য এবং খাঁটি উপাদানকে অগ্রাধিকার দিয়েছি। খাঁটি খামারের টাটকা উপকরণ আর মশলা বাড়ির প্রিজারভেটিভ-মুক্ত খাঁটি মসলার সমন্বয়েই আজ ২০২৬ সালে এসে জন্ম নিয়েছে 'লাকড়ি চুলায় রান্না'।"
            </p>
          </div>
        </Container>
      </div> */}

      {/* 4. Three Core Problems & Solutions */}
      <Container className="mb-24">
        <div className="text-center mb-16">
          <SectionTitle 
            titleBn="কেন লাকড়ি চুলায় রান্না?" 
            subtitle="বাঙালির খাদ্যাভ্যাসে যে ৩টি গুরুতর সমস্যা আমরা চিহ্নিত করেছি" 
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {problems.map((prob, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl border border-cream-dark shadow-sm hover:shadow-xl hover:border-fire/20 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-fire/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-300" />
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-cream rounded-xl group-hover:bg-fire-light/10 transition-colors">
                  {prob.icon}
                </div>
                <span className="text-5xl font-black text-fire/10 font-latin group-hover:text-fire/20 transition-colors">{prob.num}</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-4 group-hover:text-fire transition-colors">{prob.title}</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">{prob.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* The Solution Callout */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 bg-gradient-to-br from-fire to-terracotta text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-white/20 text-xs font-bold px-3 py-1  rounded-full uppercase tracking-wider font-latin">আমাদের সমাধান</span>
              <h3 className="text-3xl font-extrabold leading-tight mt-3">
                স্মৃতি ও ঐতিহ্যের মেলবন্ধনে ক্ষতিকারক প্রিজারভেটিভ ও কৃত্রিম স্বাদ-মুক্ত স্বাস্থ্যকর সমাধান!
              </h3>
              <p className="text-white/90 text-sm md:text-base leading-relaxed">
                আমরা ফিরিয়ে এনেছি সেই চিরচেনা মাটির হাঁড়ির রান্নার ঐতিহ্য। মাটির সানকিতে কাঠের চুলার মৃদু আঁচে রান্না করা খাবার আমরা সরবরাহ করছি সাশ্রয়ী মূল্যে এবং পরিবেশবান্ধব মাটির পাত্রে (Clay Pots), যা আপনার খাবারকে রাখে সতেজ এবং ফিরিয়ে দেয় শৈশবের হারিয়ে যাওয়া সেই ধোঁয়াটে স্বাদের আসল তৃপ্তি।
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner animate-float">
                <ChefHat className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </Container>

      {/* 5. The Emotional Connect Section */}
      <div className="bg-cream-dark/30 py-20 border-y border-cream-dark">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-extrabold text-charcoal-light">
                শৈশবের স্মৃতি ও মাটির চুলার ভালোবাসা
              </h3>
              <p className="text-base leading-relaxed text-charcoal/80">
                আমাদের যাদের বয়স ৪০+ তারা ছোটবেলায় মা-বাবা কিংবা দাদীদের কাঠের চুলায় রান্না করতে দেখেছি। আর যাদের বয়স ২৫+ তারা ছোটবেলায় গ্রামে বেড়াতে গিয়ে সকালের কুয়াশা ও বিকেলে মাটির চুলার ধোঁয়াটে গন্ধ আর রান্নার স্বাদ বুকে জমিয়ে রেখেছেন। আমাদের অবচেতন মন জানে, সবচেয়ে সুস্বাদু খাবার সেটাই যা কোনো কৃত্রিমতা ছাড়াই ধীর আঁচে কাঠের আগুনে ভালোবাসার সাথে রান্না হয়।
              </p>
              <p className="text-base leading-relaxed text-charcoal/80">
                লাকড়ি চুলায় রান্না আধুনিক শহুরে ভোজনরসিকদের মাঝে সেই অনুভূতি ও স্মৃতির সেতু বন্ধন হিসেবে কাজ করছে। আমরা যখন মাটির পাত্রে এই খাবারগুলো আধুনিক বাঙালির পাতে তুলে দিলাম, তখন সবাই নির্দ্বিধায় ও আগ্রহের সাথে তা গ্রহণ করতে লাগলেন।
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-1 bg-white rounded-3xl border border-cream-dark shadow-lg overflow-hidden group"
            >
              <div className="p-8 bg-charcoal text-cream rounded-2xl space-y-6 relative">
                <div className="absolute top-4 right-4 text-fire opacity-20">
                  <Utensils className="w-24 h-24" />
                </div>
                <span className="text-fire font-bold text-sm tracking-wider uppercase font-latin">স্টোরিটেলিং ও কনটেন্ট মার্কেটিং</span>
                <h4 className="text-2xl font-bold text-cream">স্ক্রিনে তো ঘ্রাণ নেওয়া যায় না!</h4>
                <p className="text-cream/70 text-sm leading-relaxed">
                  ই-কমার্স ও ফুড ডেলিভারি ব্যবসার সবচেয়ে বড় চ্যালেঞ্জ হলো: মোবাইল বা কম্পিউটারের স্ক্রিন দিয়ে অনেক কিছু চমৎকারভাবে দেখানো গেলেও সুস্বাদু খাবারের ধোঁয়াটে সুবাস ও স্বাদ সরাসরি নেয়া যায় না। 
                </p>
                <p className="text-cream/70 text-sm leading-relaxed">
                  এই চ্যালেঞ্জ জয় করতে আমরা বেছে নিয়েছি স্টোরিটেলিং এবং কনটেন্ট মার্কেটিংয়ের পথ। আমাদের প্রতিটি খাবারের ঘ্রাণ ও স্বাদকে আমরা বাঙালির হাজার বছরের চেনা অনুভূতির সাথে মিলিয়ে ব্যাখ্যা করি। আলহামদুলিল্লাহ, আমাদের গ্রাহকেরা প্রথম কামড়েই সেই ভালোবাসার সত্যতা খুঁজে পেয়েছেন!
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* 6. Achievement / DUICE */}
      {/* <Container className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-cream-dark rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-md relative overflow-hidden"
        >
          <div className="absolute -left-12 -top-12 w-32 h-32 bg-fire/5 rounded-full blur-xl" />
          <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-terracotta/5 rounded-full blur-xl" />
          <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-6 border border-fire/10">
            <Award className="w-8 h-8 text-fire" />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-charcoal mb-4">
            আমাদের একটি গর্বিত মাইলফলক ও ২০৪১ ভিশন
          </h3>
          <p className="text-charcoal/70 text-base leading-relaxed mb-6">
            খুবই অল্প সময়ের পথচলায় আমাদের অন্যতম বড় প্রাপ্তি হলো: ২০৪১ সালের মধ্যে বাংলাদেশকে একটি উন্নত দেশ হিসেবে গড়ে তুলতে এবং বিশ্ব দরবারে আমাদের নিজস্ব খাদ্যাভ্যাস ও রন্ধনশিল্পের ঐতিহ্য তুলে ধরতে যে ৪১টি গুরুত্বপূর্ণ উদ্যোগ ভূমিকা রাখবে বলে আশা প্রকাশ করেছে <strong className="text-charcoal-light">ডি.ইউ.আই.সি.ই. (DUICE) সেন্টার</strong>, তার মধ্যে <strong className="text-fire">"লাকড়ি চুলায় রান্না"</strong> অন্যতম একটি উদ্যোগ হিসেবে স্থান পেয়েছে। আলহামদুলিল্লাহ!
          </p>
          <div className="w-full h-px bg-cream-dark my-6" />
          <p className="text-xs text-muted-light font-latin uppercase tracking-widest font-semibold">
            ESTABLISHED MAY 2026 • DHAKA, BANGLADESH
          </p>
        </motion.div>
      </Container> */}
    </div>
  );
}
