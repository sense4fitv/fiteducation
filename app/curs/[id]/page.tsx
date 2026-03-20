"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  DollarSign,
  User,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  Star,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import { courses } from "@/data/courses";
import { trainers } from "@/data/trainers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";

export default function CoursePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState(0);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Find course by slug
  const course = courses.find((c) => c.slug === params.id) || courses[0];

  // Sticky button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { id: 0, label: "Despre curs", icon: BookOpen },
    { id: 1, label: "Programa", icon: Target },
    { id: 2, label: "Formatori", icon: Users },
    { id: 3, label: "Inscriere si certificare", icon: Award },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "" });
      setSubmitSuccess(false);
    }, 3000);
  };

  const scrollToEnrollment = () => {
    document.getElementById("enrollment")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Breadcrumbs */}
      <section className="pt-24 pb-4 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <a href="/" className="hover:text-[#B8001F] transition-colors">
              Acasă
            </a>
            <ChevronRight size={16} />
            <a href="/#specializari" className="hover:text-[#B8001F] transition-colors">
              Cursuri
            </a>
            <ChevronRight size={16} />
            <span className="text-[#0A0A0A] font-medium">{course.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Section - Simplified */}
      <section className="pb-8 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] sm:h-[500px] bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/85 to-transparent" />
            </div>

            <div className="relative h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)] leading-tight max-w-3xl"
              >
                {course.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg sm:text-xl text-[#A0A0A0] mb-8 max-w-2xl"
              >
                {course.description}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                onClick={scrollToEnrollment}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#B8001F] text-white rounded-full font-semibold text-lg hover:bg-[#490207] transition-all duration-300 hover:shadow-lg hover:shadow-[#B8001F]/50 w-fit"
              >
                Înscrie-te Acum
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Info Bar */}
      <section className="py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-2xl mx-auto">
              {/* Price */}
              <div className="flex flex-col text-center">
                <span className="text-sm text-[#666666] mb-2">Preț</span>
                <span className="text-3xl font-bold text-[#0A0A0A]">
                  {course.price}
                </span>
              </div>

              {/* Start Date */}
              <div className="flex flex-col text-center">
                <span className="text-sm text-[#666666] mb-2">Data de început</span>
                <span className="text-3xl font-bold text-[#B8001F]">
                  {course.nextStartDate}
                </span>
              </div>
            </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          >
            {/* Tabs Header */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
              {tabs.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 whitespace-nowrap transition-all duration-300 border-b-2 ${
                      activeTab === tab.id
                        ? "text-[#B8001F] border-[#B8001F] bg-[#B8001F]/5"
                        : "text-[#666666] border-transparent hover:text-[#0A0A0A] hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-12"
            >
              {/* Tab 0: Despre curs */}
              {activeTab === 0 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-8 font-[family-name:var(--font-space-grotesk)]">
                    Despre Curs
                  </h2>

                  {/* Quick Info Cards */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-gradient-to-br from-[#B8001F]/10 to-[#B8001F]/5 rounded-xl p-6 border border-[#B8001F]/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock size={24} className="text-[#B8001F]" />
                        <h3 className="text-sm font-semibold text-[#666666] uppercase tracking-wide">
                          Durată
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-[#0A0A0A]">1080 ore</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#B8001F]/10 to-[#B8001F]/5 rounded-xl p-6 border border-[#B8001F]/20">
                      <div className="flex items-center gap-3 mb-2">
                        <GraduationCap size={24} className="text-[#B8001F]" />
                        <h3 className="text-sm font-semibold text-[#666666] uppercase tracking-wide">
                          Nivel
                        </h3>
                      </div>
                      <p className="text-lg font-bold text-[#0A0A0A]">Absolvent liceu</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#B8001F]/10 to-[#B8001F]/5 rounded-xl p-6 border border-[#B8001F]/20">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen size={24} className="text-[#B8001F]" />
                        <h3 className="text-sm font-semibold text-[#666666] uppercase tracking-wide">
                          Limbă
                        </h3>
                      </div>
                      <p className="text-lg font-bold text-[#0A0A0A]">Română</p>
                    </div>
                  </div>

                  {/* Main Description */}
                  <div className="mb-10">
                    <div className="bg-[#0A0A0A] rounded-2xl p-8 sm:p-10 text-white">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-[#B8001F] flex items-center justify-center flex-shrink-0">
                          <Target size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2 font-[family-name:var(--font-space-grotesk)]">
                            Instructor Fitness Certification
                          </h3>
                          <p className="text-[#A0A0A0] text-sm">
                            Cel mai complex program de formare în România
                          </p>
                        </div>
                      </div>

                      <p className="text-lg text-white/90 leading-relaxed mb-6">
                        Instructor Fitness Certification este cel mai complex curs la care poți participa astăzi în România, se naște din conștientizarea complexității mișcării umane.
                      </p>

                      <p className="text-lg text-white/90 leading-relaxed">
                        Acest curs presupune răspunsul perfect la exigențele specifice pentru care am fost creați. Un program de exerciții trebuie să ia în considerare corpul în integralitatea sa în relație cu obiectivele, abilitățile funcționale și dorințele unui individ.
                      </p>
                    </div>
                  </div>

                  {/* Recognition Section */}
                  <div>
                    <h3 className="text-2xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-space-grotesk)] flex items-center gap-3">
                      <Award size={28} className="text-[#B8001F]" />
                      Recunoaștere și Certificări
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Certificate 1 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-[#FAFAFA] to-white rounded-xl p-6 border-2 border-[#B8001F]/30 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#B8001F] flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="inline-block px-3 py-1 bg-[#B8001F]/10 text-[#B8001F] text-xs font-bold rounded-full mb-3">
                              CERTIFICAT OFICIAL
                            </div>
                            <h4 className="text-lg font-bold text-[#0A0A0A] mb-2 leading-tight">
                              Certificat de Absolvire
                            </h4>
                            <p className="text-sm text-[#666666] leading-relaxed">
                              Acreditat de Ministerul Muncii și Ministerul Educației, recunoscut internațional
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Certificate 2 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-[#FAFAFA] to-white rounded-xl p-6 border-2 border-[#B8001F]/30 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#B8001F] flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="inline-block px-3 py-1 bg-[#B8001F]/10 text-[#B8001F] text-xs font-bold rounded-full mb-3">
                              DIPLOMA INTERNAȚIONALĂ
                            </div>
                            <h4 className="text-lg font-bold text-[#0A0A0A] mb-2 leading-tight">
                              Diplomă de Participare
                            </h4>
                            <p className="text-sm text-[#666666] leading-relaxed">
                              Fiteducation International School
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Additional Recognition Info */}
                    <div className="mt-6 bg-[#B8001F]/5 border-l-4 border-[#B8001F] rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <Shield size={24} className="text-[#B8001F] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-[#0A0A0A] mb-2">
                            Certificare Dublă
                          </h4>
                          <p className="text-sm text-[#666666] leading-relaxed">
                            La finalul cursului vei primi atât certificatul oficial acreditat de minister, cât și diploma internațională Fiteducation, permițându-ți să activezi ca instructor de fitness certificat în România și în străinătate.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 1: Programa */}
              {activeTab === 1 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-space-grotesk)]">
                    Competențe și Abilități
                  </h2>

                  {/* Introduction */}
                  <div className="bg-gradient-to-r from-[#B8001F] to-[#8B0018] rounded-2xl p-6 sm:p-8 mb-10 text-white">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Target size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-3 font-[family-name:var(--font-space-grotesk)]">
                          Ce vei putea face după absolvire
                        </h3>
                        <p className="text-white/90 leading-relaxed">
                          După finalizarea programului, absolvenții vor avea competențele necesare pentru a <strong>evalua, planifica, conduce și adapta programe de antrenament personalizat</strong>, în condiții de siguranță, eficiență și progres real.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Competencies Grid */}
                  <div className="space-y-6">
                    {/* Competency 1 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <Target size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să evalueze corect clienții și să stabilească obiective realiste
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să efectueze evaluări inițiale: postură, mobilitate, forță, rezistență, compoziție corporală</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să identifice dezechilibre musculare și limitări funcționale</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să stabilească obiective SMART în funcție de nivel, vârstă și istoric medical</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să utilizeze chestionare PAR-Q și protocoale de siguranță</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Competency 2 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să construiască programe de antrenament personalizate
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să elaboreze planuri de antrenament pentru: slăbire, tonifiere, hipertrofie, forță, rezistență</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să aplice principiile periodizării și progresiei</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să structureze corect o ședință de antrenament (încălzire, partea principală, cooldown)</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să adapteze exercițiile în funcție de nivelul clientului</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Competency 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <Zap size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să aplice corect tehnica exercițiilor de fitness
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să execute și să corecteze exerciții cu greutăți libere, aparate și greutatea corpului</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să înțeleagă biomecanica mișcării și lanțurile kinetice</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să prevină accidentările prin execuție corectă și dozaj optim</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să utilizeze exerciții funcționale, multiplanare și full body</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Competency 4 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <Users size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să lucreze eficient cu diferite tipologii de clienți
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Începători, intermediari și avansați</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Persoane sedentare sau supraponderale</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Clienți cu limitări articulare ușoare sau posturale</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Clienți orientați spre performanță estetică sau sportivă</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Clienți care urmăresc sănătatea și menținerea pe termen lung</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Competency 5 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <Star size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să aplice noțiuni de bază din nutriție și lifestyle
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să înțeleagă principiile nutriției pentru fitness și controlul greutății</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să ofere recomandări generale de alimentație sănătoasă (în limitele competenței)</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să educe clienții privind hidratarea, recuperarea și somnul</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să colaboreze eficient cu nutriționiști și alți specialiști</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Competency 6 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să comunice profesionist și să construiască relații durabile cu clienții
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să dezvolte abilități de comunicare, motivație și coaching</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să gestioneze relația antrenor–client într-un mod etic și profesionist</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să mențină aderența clientului la program</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să creeze un climat de încredere și siguranță</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Competency 7 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <Shield size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să respecte cadrul legal, etic și profesional
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să înțeleagă responsabilitățile legale ale Instructorului Fitness</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să aplice norme de siguranță și igienă</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să lucreze conform codului etic profesional</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să știe când și cum să direcționeze clientul către alți specialiști</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Competency 8 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să utilizeze instrumente moderne din fitness
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să lucreze cu aplicații de tracking și planificare antrenamente</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să folosească echipamente moderne și accesorii funcționale</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să monitorizeze progresul și să ajusteze programele în timp</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să înțeleagă indicatori de performanță și progres</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Competency 9 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0">
                          <Award size={20} className="text-[#B8001F]" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#0A0A0A] flex-1">
                          Să își construiască o carieră și un business în fitness
                        </h4>
                      </div>
                      <ul className="space-y-2.5 ml-14">
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să lucreze ca Personal Trainer în sală sau independent</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să își construiască un portofoliu de clienți</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să înțeleagă bazele marketingului personal în fitness</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să dezvolte servicii 1:1, small group training sau online coaching</span>
                        </li>
                        <li className="flex items-start gap-3 text-[#666666]">
                          <CheckCircle2 size={18} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                          <span>Să creeze o identitate profesională clară și credibilă</span>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Tab 2: Formatori */}
              {activeTab === 2 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-space-grotesk)]">
                    Formatorii Cursului
                  </h2>
                  <p className="text-lg text-[#666666] mb-10">
                    Echipa noastră de formatori certificați internațional îți va oferi toată experiența și cunoștințele necesare pentru a avea succes în domeniul fitness.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {trainers.map((trainer, index) => (
                      <motion.div
                        key={trainer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border-2 border-gray-100 hover:border-[#B8001F]/30 transition-all p-6 shadow-sm hover:shadow-lg group"
                      >
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Trainer Image */}
                          <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#B8001F]/20 to-[#B8001F]/5 mx-auto sm:mx-0">
                            <Image
                              src={trainer.image}
                              alt={trainer.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Trainer Info */}
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#0A0A0A] mb-2 font-[family-name:var(--font-space-grotesk)]">
                              {trainer.name}
                            </h3>
                            <p className="text-[#666666] leading-relaxed">
                              {trainer.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Team Highlight */}
                  <div className="mt-10 bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] rounded-2xl p-8 text-white">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#B8001F] flex items-center justify-center flex-shrink-0">
                        <Award size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3 font-[family-name:var(--font-space-grotesk)]">
                          Echipă de Experți
                        </h3>
                        <p className="text-white/90 leading-relaxed">
                          Formatorii noștri combină experiența academică cu cea practică, având certificări internaționale și mii de ore de predare. Vei beneficia de mentorat direct de la profesioniști activi în domeniu, care înțeleg atât teoria, cât și provocările reale din industria fitness.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Inscriere si certificare */}
              {activeTab === 3 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-8 font-[family-name:var(--font-space-grotesk)]">
                    Înscriere și Certificare
                  </h2>

                  {/* Documente necesare */}
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-[#B8001F]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0A0A0A]">
                        Acte Necesare
                      </h3>
                    </div>

                    <div className="grid gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-4 bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-[#B8001F]/30 transition-all"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#B8001F] font-bold text-sm">1</span>
                        </div>
                        <p className="text-[#0A0A0A] leading-relaxed">
                          Copie certificat de naștere
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-4 bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-[#B8001F]/30 transition-all"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#B8001F] font-bold text-sm">2</span>
                        </div>
                        <p className="text-[#0A0A0A] leading-relaxed">
                          Copie după ultima formă de învățământ absolvită (minim studii liceale)
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-4 bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-[#B8001F]/30 transition-all"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#B8001F] font-bold text-sm">3</span>
                        </div>
                        <p className="text-[#0A0A0A] leading-relaxed">
                          Copie carte de identitate
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start gap-4 bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-[#B8001F]/30 transition-all"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#B8001F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#B8001F] font-bold text-sm">4</span>
                        </div>
                        <p className="text-[#0A0A0A] leading-relaxed">
                          Copie certificat de căsătorie (dacă este cazul)
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-start gap-4 bg-gradient-to-r from-[#B8001F]/10 to-[#B8001F]/5 border-2 border-[#B8001F]/30 rounded-xl p-5"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#B8001F] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-sm">5</span>
                        </div>
                        <p className="text-[#0A0A0A] leading-relaxed">
                          <strong>Adeverință medicală în original</strong>, care să ateste faptul că participantul este apt pentru activități sportive
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Examen și Certificare */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center">
                        <Award size={24} className="text-[#B8001F]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0A0A0A]">
                        Examen Final și Certificare
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {/* Format Examen */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-[#B8001F]/30 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center">
                            <BookOpen size={20} className="text-[#B8001F]" />
                          </div>
                          <h4 className="text-lg font-bold text-[#0A0A0A]">
                            Format Examen
                          </h4>
                        </div>
                        <p className="text-[#666666] leading-relaxed">
                          {course.exam.format}
                        </p>
                      </motion.div>

                      {/* Certificare */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-[#B8001F]/30 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#B8001F]/10 flex items-center justify-center">
                            <Award size={20} className="text-[#B8001F]" />
                          </div>
                          <h4 className="text-lg font-bold text-[#0A0A0A]">
                            Certificare
                          </h4>
                        </div>
                        <p className="text-[#666666] leading-relaxed">
                          {course.exam.certification}
                        </p>
                      </motion.div>
                    </div>

                    {/* Certification Highlight */}
                    <div className="bg-gradient-to-r from-[#B8001F] to-[#8B0018] rounded-2xl p-8 text-white">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                          <Award size={28} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold mb-3 font-[family-name:var(--font-space-grotesk)]">
                            Certificare Recunoscută Internațional
                          </h4>
                          <p className="text-white/95 leading-relaxed text-lg">
                            Certificarea obținută este recunoscută internațional și îți va permite să activezi ca profesionist în domeniu în România și în multe țări din Uniunea Europeană.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Enrollment Form */}
      <section id="enrollment" className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-lg"
          >
            <div className="bg-[#0A0A0A] p-8 sm:p-12 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">
                Solicită Înscriere
              </h2>
              <p className="text-[#A0A0A0] text-lg mb-6">
                Completează formularul și te vom contacta în cel mai scurt timp
                cu toate detaliile necesare pentru înscrierea ta.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#B8001F]" />
                  <span className="text-white">Răspuns în 24 de ore</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#B8001F]" />
                  <span className="text-white">Consultanță gratuită</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#B8001F]" />
                  <span className="text-white">
                    Informații despre opțiuni de plată
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 sm:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-[#0A0A0A] mb-2"
                  >
                    Nume Complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent transition-all"
                    placeholder="Ion Popescu"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#0A0A0A] mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent transition-all"
                    placeholder="ion@exemplu.ro"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-[#0A0A0A] mb-2"
                  >
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent transition-all"
                    placeholder="0712 345 678"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  whileHover={{ scale: submitSuccess ? 1 : 1.02 }}
                  whileTap={{ scale: submitSuccess ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                    submitSuccess
                      ? "bg-green-500 text-white"
                      : "bg-[#B8001F] text-white hover:bg-[#490207] hover:shadow-lg hover:shadow-[#B8001F]/50"
                  }`}
                >
                  {isSubmitting
                    ? "Se trimite..."
                    : submitSuccess
                      ? "✓ Trimis cu succes!"
                      : "Trimite Cererea"}
                </motion.button>

                <p className="text-sm text-[#666666] text-center">
                  Prin trimiterea formularului ești de acord cu{" "}
                  <a href="#" className="text-[#B8001F] hover:underline">
                    politica de confidențialitate
                  </a>
                  .
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky CTA Button */}
      {showStickyButton && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={scrollToEnrollment}
          className="fixed bottom-8 right-8 bg-[#B8001F] text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:bg-[#490207] transition-all duration-300 hover:scale-105 z-40 flex items-center gap-2"
        >
          <span>Înscrie-te Acum</span>
          <ChevronRight size={20} />
        </motion.button>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
