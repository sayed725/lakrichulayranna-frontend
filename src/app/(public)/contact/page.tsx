"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Truck, Mail, Phone, Send, MessageSquare, Loader2 } from "lucide-react";
import { Container } from "@/components/shared/container/Container";
import { SectionTitle } from "@/components/shared/section-title/SectionTitle";
import api from "@/lib/fetcher";
import { API_ROUTES } from "@/lib/constants";
import { toast } from "sonner";

const operations = [
  {
    icon: <Clock className="w-6 h-6 text-fire" />,
    title: "কার্যক্ষম সময়",
    details: ["রবিবার - বৃহস্পতিবার", "সকাল ৯টা - রাত ৮টা", "শুক্রবার বন্ধ"],
  },
  {
    icon: <Truck className="w-6 h-6 text-terracotta" />,
    title: "ডেলিভারি সময়সূচি",
    details: [
      "একই দিনের ডেলিভারি: দুপুর ২টার আগে অর্ডার করুন",
      "পরের দিনের ডেলিভারি: দুপুর ২টার পর অর্ডার করুন",
      "ঢাকার বাইরে: ২-৩ কার্যদিবস",
    ],
  },
  {
    icon: <MapPin className="w-6 h-6 text-charcoal" />,
    title: "পিকআপ এবং কর্পোরেট",
    details: [
      "বাল্ক অর্ডারের জন্য ৪৮ ঘণ্টা আগে জানান",
      "কর্পোরেট ক্যাটারিং উপলব্ধ",
      "সময়সূচির মধ্যে দোকান থেকে পিকআপ করুন",
    ],
  },
];

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "ঢাকা, বাংলাদেশ",
    subtitle: "নবাবগঞ্জ, ঢাকা ১৩২০",
    gradient: "from-fire to-terracotta",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "+8801627142598",
    subtitle: "রবি থেকে বৃহস্পতিবার সকাল ৯টা থেকে রাত ৮টা",
    gradient: "from-terracotta to-charcoal",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "abusayedkhan.pro@gmail.com",
    subtitle: "যেকোনো সময় প্রশ্ন পাঠান!",
    gradient: "from-fire-light to-fire",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "+8801627142598",
    subtitle: "হোয়াটসঅ্যাপ — ২৪/৭ উপলব্ধ!",
    gradient: "from-charcoal to-terracotta",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // console.log("Submitting contact form with data:", formData);
      await api.post(API_ROUTES.CONTACTS.BASE, formData);
      toast.success("বার্তা পাঠানো হয়েছে!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      // console.error("Error submitting contact form:", error);
      // console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream overflow-hidden">
      {/* Contact Form Section */}
      <section id="contact" className="py-10 relative overflow-hidden">
        {/* Ambient background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-fire/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-terracotta/5 rounded-full blur-[100px]" />
        </div>

        <Container className="relative z-10">
          <div className="text-center mb-5 max-w-2xl mx-auto flex flex-col items-center">
            <SectionTitle
              titleBn="যোগাযোগ করুন"
              subtitle="আমাদের খাবার, বাল্ক অর্ডার বা সহযোগিতার বিষয়ে প্রশ্ন আছে? নির্দ্বিধায় যোগাযোগ করুন। আমরা সাহায্য করতে এখানে আছি!"
              align="center"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2 h-full"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-8 shadow-xl h-full flex flex-col">
                <h3 className="text-2xl font-black text-charcoal mb-2 font-bengali">
                  আসুন কথা বলি!
                </h3>
                <p className="text-charcoal/70 text-sm mb-8 font-bengali">
                  ফর্ম পছন্দ করেন না? আমাদের ইমেইল পাঠান বা হোয়াটসঅ্যাপে যোগাযোগ করুন। 👋
                </p>

                <div className="space-y-4 flex-1">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-cream/50 border border-transparent hover:border-border transition-all cursor-default group"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-charcoal font-bold text-sm sm:text-base break-all sm:break-normal font-bengali">
                          {item.title}
                        </p>
                        <p className="text-muted text-xs sm:text-sm mt-0.5 truncate sm:whitespace-normal font-bengali">
                          {item.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-3 h-full"
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white/80 backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-8 shadow-xl h-full flex flex-col"
              >
                <div className="flex-1 flex flex-col space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-muted uppercase tracking-wider font-bold font-bengali">
                        আপনার নাম
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="আবু সায়েদ খান"
                        required
                        className="w-full px-5 py-3.5 rounded-xl bg-cream border border-border text-charcoal placeholder:text-muted text-sm focus:outline-none focus:border-fire focus:ring-1 focus:ring-fire transition-all appearance-none font-bengali"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted uppercase tracking-wider font-bold font-bengali">
                        ইমেইল ঠিকানা
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-5 py-3.5 rounded-xl bg-cream border border-border text-charcoal placeholder:text-muted text-sm focus:outline-none focus:border-fire focus:ring-1 focus:ring-fire transition-all appearance-none"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-xs text-muted uppercase tracking-wider font-bold font-bengali">
                      বিষয়
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="বাল্ক অর্ডার অনুসন্ধান"
                      required
                      className="w-full px-5 py-3.5 rounded-xl bg-cream border border-border text-charcoal placeholder:text-muted text-sm focus:outline-none focus:border-fire focus:ring-1 focus:ring-fire transition-all appearance-none font-bengali"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2 flex-1 flex flex-col">
                    <label className="text-xs text-muted uppercase tracking-wider font-bold font-bengali">
                      বার্তা
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="আপনার প্রয়োজন সম্পর্কে বলুন..."
                      required
                      className="w-full flex-1 px-5 py-3.5 rounded-xl bg-cream border border-border text-charcoal placeholder:text-muted text-sm focus:outline-none focus:border-fire focus:ring-1 focus:ring-fire transition-all resize-none font-bengali"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 mt-auto">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-fire to-terracotta text-white hover:shadow-lg hover:shadow-fire/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base font-bold gap-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-bengali"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        পাঠানো হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        বার্তা পাঠান
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Operations & Delivery Info */}
      <section className="py-10 relative">
        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {operations.map((op, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                }}
                className="bg-white/80 backdrop-blur-xl border border-border rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-cream border border-border flex items-center justify-center mb-6 shadow-sm">
                  {op.icon}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-4 font-bengali">
                  {op.title}
                </h3>
                <ul className="space-y-2 text-charcoal/70 text-sm font-medium font-bengali">
                  {op.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Map Embed */}
      <section className="py-10">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden border border-border shadow-2xl h-[400px] md:h-[500px]"
          >
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-fire to-terracotta opacity-20" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.204555021575!2d90.0984857!3d23.7455431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755ecab183b5d21%3A0xc3b8fb32e7c9f6d7!2sNawabganj%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="relative z-10 w-full h-full grayscale-[20%] contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
