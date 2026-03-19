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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

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

  // Mock course data
  const course = courses[0];

  // Sticky button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { id: 0, label: "Programă & Curriculum", icon: BookOpen },
    { id: 1, label: "Formatori", icon: Users },
    { id: 2, label: "Înscriere & Certificare", icon: Award },
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              {/* Price */}
              <div className="flex flex-col text-center">
                <span className="text-sm text-[#666666] mb-2">Preț</span>
                <span className="text-2xl font-bold text-[#0A0A0A]">
                  {course.price}
                </span>
              </div>

              {/* Duration */}
              <div className="flex flex-col text-center">
                <span className="text-sm text-[#666666] mb-2">Durată</span>
                <span className="text-2xl font-bold text-[#0A0A0A]">
                  {course.duration}
                </span>
              </div>

              {/* Start Date */}
              <div className="flex flex-col text-center">
                <span className="text-sm text-[#666666] mb-2">Început</span>
                <span className="text-2xl font-bold text-[#0A0A0A]">
                  {course.nextStartDate}
                </span>
              </div>

              {/* Spots Left */}
              <div className="flex flex-col text-center">
                <span className="text-sm text-[#666666] mb-2">Locuri</span>
                <span className="text-2xl font-bold text-[#B8001F]">
                  {course.spotsLeft} rămase
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
              {/* Tab 0: Programă & Curriculum */}
              {activeTab === 0 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-space-grotesk)]">
                    Programă și Orar
                  </h2>

                  <div className="bg-[#B8001F]/10 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar size={24} className="text-[#B8001F]" />
                      <h3 className="text-xl font-bold text-[#0A0A0A]">
                        Program
                      </h3>
                    </div>
                    <p className="text-lg text-[#0A0A0A] font-medium">
                      {course.curriculum.schedule}
                    </p>
                  </div>

                  <h3 className="text-2xl font-bold text-[#0A0A0A] mb-6">
                    Curriculum Detaliat
                  </h3>
                  <div className="space-y-6">
                    {course.curriculum.modules.map((module, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#FAFAFA] rounded-xl p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-[#B8001F] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-[#0A0A0A] mb-3">
                              {module.title}
                            </h4>
                            <ul className="space-y-2">
                              {module.topics.map((topic, topicIndex) => (
                                <li
                                  key={topicIndex}
                                  className="flex items-start gap-2 text-[#666666]"
                                >
                                  <span className="text-[#B8001F] mt-1">•</span>
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 1: Formatori */}
              {activeTab === 1 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-space-grotesk)]">
                    Formatorii Cursului
                  </h2>
                  <p className="text-lg text-[#666666] mb-8">
                    Echipa noastră de formatori certificați internațional îți va
                    oferi toată experiența și cunoștințele necesare pentru a
                    avea succes.
                  </p>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {course.trainers.map((trainer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#FAFAFA] rounded-xl overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row gap-6 p-6">
                          <div
                            className="w-24 h-24 rounded-full bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage: `url(https://images.unsplash.com/photo-${
                                index % 2 === 0
                                  ? "1568602471122-7832951cc4c5"
                                  : "1438761681033-6461ffad8d80"
                              }?w=200)`,
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#0A0A0A] mb-1">
                              {trainer.name}
                            </h3>
                            <p className="text-[#B8001F] font-semibold mb-3">
                              {trainer.role}
                            </p>
                            <p className="text-[#666666]">{trainer.bio}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Înscriere & Certificare */}
              {activeTab === 2 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-8 font-[family-name:var(--font-space-grotesk)]">
                    Înscriere și Certificare
                  </h2>

                  {/* Documente necesare */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-[#0A0A0A] mb-4">
                      Documente Necesare
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {course.requirements.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-[#FAFAFA] rounded-lg p-4"
                        >
                          <CheckCircle2
                            size={20}
                            className="text-[#B8001F] flex-shrink-0"
                          />
                          <span className="text-[#0A0A0A]">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Taxe */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-[#0A0A0A] mb-4">
                      Structura Taxelor
                    </h3>
                    <div className="bg-[#0A0A0A] rounded-xl p-8 text-white">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/20">
                          <span className="text-[#A0A0A0]">Taxă înscriere</span>
                          <span className="font-semibold text-lg">
                            {course.requirements.fees.inscription}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/20">
                          <span className="text-[#A0A0A0]">Taxă lunară</span>
                          <span className="font-semibold text-lg">
                            {course.requirements.fees.monthly}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xl font-bold">Total</span>
                          <span className="text-3xl font-bold text-[#B8001F]">
                            {course.requirements.fees.total}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-sm text-[#A0A0A0]">
                          ✓ Posibilitate de plată în rate fără dobândă
                        </p>
                        <p className="text-sm text-[#A0A0A0]">
                          ✓ Reduceri pentru plata integrală în avans
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Examen și Certificare */}
                  <div>
                    <h3 className="text-2xl font-bold text-[#0A0A0A] mb-4">
                      Examen Final și Certificare
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#FAFAFA] rounded-xl p-6">
                        <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">
                          Format Examen
                        </h4>
                        <p className="text-[#666666]">{course.exam.format}</p>
                      </div>
                      <div className="bg-[#FAFAFA] rounded-xl p-6">
                        <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">
                          Durată
                        </h4>
                        <p className="text-[#666666]">{course.exam.duration}</p>
                      </div>
                      <div className="bg-[#FAFAFA] rounded-xl p-6">
                        <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">
                          Notă de Promovare
                        </h4>
                        <p className="text-[#666666]">
                          {course.exam.passingGrade}
                        </p>
                      </div>
                      <div className="bg-[#FAFAFA] rounded-xl p-6">
                        <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">
                          Certificare
                        </h4>
                        <p className="text-[#666666]">
                          {course.exam.certification}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#B8001F] to-[#490207] rounded-xl p-8 text-white">
                      <div className="flex items-start gap-4">
                        <Award size={40} className="flex-shrink-0" />
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            Certificare Recunoscută Internațional
                          </h3>
                          <p className="text-white/90">
                            Certificarea obținută este recunoscută internațional
                            și îți va permite să activezi ca profesionist în
                            domeniu în România și în multe țări din Uniunea
                            Europeană.
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

      {/* What's Included */}
      <section className="py-12 px-4 sm:px-8 lg:px-16 bg-[#FAFAFA]">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-8 font-[family-name:var(--font-space-grotesk)] text-center">
              Ce primești
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {course.included.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 w-full max-w-md"
                >
                  <CheckCircle2
                    size={20}
                    className="text-[#B8001F] flex-shrink-0 mt-1"
                  />
                  <span className="text-[#0A0A0A]">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] mb-4 font-[family-name:var(--font-space-grotesk)] text-center">
              Întrebări Frecvente
            </h2>
            <p className="text-lg text-[#666666] text-center mb-12">
              Tot ce trebuie să știi despre curs
            </p>

            <div className="space-y-4">
              {course.faq.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-bold text-[#0A0A0A] pr-4">
                      {item.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp size={24} className="text-[#B8001F] flex-shrink-0" />
                    ) : (
                      <ChevronDown size={24} className="text-[#666666] flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-5">
                      <p className="text-[#666666] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
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
