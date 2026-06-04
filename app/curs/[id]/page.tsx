"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { courses } from "@/data/courses";
import { trainers } from "@/data/trainers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";

export default function CoursePage({ params }: { params: { id: string } }) {
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [activeSection, setActiveSection] = useState("despre");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navTriggerRef = useRef<HTMLDivElement>(null);

  const course = courses.find((c) => c.slug === params.id) || courses[0];

  const sections = [
    { id: "despre", label: "Despre curs" },
    { id: "competente", label: "Competențe" },
    { id: "formatori", label: "Formatori" },
    { id: "inscriere", label: "Înscriere" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 600);

      // Show sticky nav after info bar
      if (navTriggerRef.current) {
        const rect = navTriggerRef.current.getBoundingClientRect();
        setShowStickyNav(rect.bottom < 64);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const sectionIds = ["despre", "competente", "formatori", "inscriere"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

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
        <div className="max-w-[1200px] mx-auto">
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

      {/* Hero Section */}
      <section className="pb-8 sm:px-8 lg:px-16">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] sm:h-[500px] bg-[#0A0A0A] sm:rounded-3xl overflow-hidden shadow-2xl"
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
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-[family-name:var(--font-unbounded)] leading-tight max-w-3xl"
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

              {course.id === 1 ? (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  href="https://checkout.sense4fitsummit.com/pages/index_beta?spid=prod_UBjZWMpQiKFT1k"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#B8001F] text-white rounded-full font-semibold text-lg hover:bg-[#490207] transition-all duration-300 hover:shadow-lg hover:shadow-[#B8001F]/50 w-fit"
                >
                  Cumpără Acum
                </motion.a>
              ) : (
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
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Info Bar */}
      <section ref={navTriggerRef} className="py-8 sm:py-10 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1200px] mx-auto">
          {/* Mobile: compact list */}
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#999]">Preț</span>
              <span className="text-base font-bold text-[#0A0A0A]">{course.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#999]">Data de început</span>
              <span className="text-base font-bold text-[#B8001F]">{course.nextStartDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#999]">Durată</span>
              <span className="text-base font-bold text-[#0A0A0A]">1080 ore</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#999]">Nivel minim</span>
              <span className="text-base font-bold text-[#0A0A0A]">Absolvent liceu</span>
            </div>
          </div>
          {/* Desktop: 4-column grid */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-8">
            <div>
              <p className="text-sm text-[#999] mb-1">Preț</p>
              <p className="text-2xl font-bold text-[#0A0A0A]">{course.price}</p>
            </div>
            <div>
              <p className="text-sm text-[#999] mb-1">Data de început</p>
              <p className="text-2xl font-bold text-[#B8001F]">{course.nextStartDate}</p>
            </div>
            <div>
              <p className="text-sm text-[#999] mb-1">Durată</p>
              <p className="text-2xl font-bold text-[#0A0A0A]">1080 ore</p>
            </div>
            <div>
              <p className="text-sm text-[#999] mb-1">Nivel minim</p>
              <p className="text-2xl font-bold text-[#0A0A0A]">Absolvent liceu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Section Nav */}
      <div
        className={`sticky top-0 z-30 transition-all duration-300 ${
          showStickyNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-sm border-b border-[#E5E5E5]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16">
            <nav className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeSection === section.id
                      ? "text-[#B8001F] border-[#B8001F]"
                      : "text-[#666] border-transparent hover:text-[#0A0A0A]"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16">
        <hr className="border-[#E5E5E5]" />
      </div>

      {/* Despre Curs */}
      <section id="despre" className="py-16 px-4 sm:px-8 lg:px-16 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-unbounded)]">
            Despre Curs
          </h2>

          <div className="max-w-3xl space-y-5 text-lg text-[#444] leading-relaxed">
            <p>
              <strong className="text-[#0A0A0A]">Instructor Fitness Certification</strong> este cel mai complex curs la care poți participa astăzi în România, se naște din conștientizarea complexității mișcării umane.
            </p>
            <p>
              Acest curs presupune răspunsul perfect la exigențele specifice pentru care am fost creați. Un program de exerciții trebuie să ia în considerare corpul în integralitatea sa în relație cu obiectivele, abilitățile funcționale și dorințele unui individ.
            </p>
          </div>

          {/* Certification info */}
          <div className="mt-10 max-w-3xl">
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-4 font-[family-name:var(--font-unbounded)]">
              Recunoaștere și Certificări
            </h3>
            <p className="text-[#444] leading-relaxed mb-4">
              La finalul cursului vei primi:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                <span className="text-[#444]">
                  <strong className="text-[#0A0A0A]">Certificat de Absolvire</strong> — acreditat de Ministerul Muncii și Ministerul Educației, recunoscut internațional
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#B8001F] flex-shrink-0 mt-0.5" />
                <span className="text-[#444]">
                  <strong className="text-[#0A0A0A]">Diplomă de Participare</strong> — Fiteducation International School, permițându-ți să activezi în România și în străinătate
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16">
        <hr className="border-[#E5E5E5]" />
      </div>

      {/* Competențe */}
      <section id="competente" className="py-16 px-4 sm:px-8 lg:px-16 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-3 font-[family-name:var(--font-unbounded)]">
            Ce vei putea face după absolvire
          </h2>
          <p className="text-lg text-[#666] mb-10 max-w-3xl">
            Absolvenții vor avea competențele necesare pentru a evalua, planifica, conduce și adapta programe de antrenament personalizat, în condiții de siguranță, eficiență și progres real.
          </p>

          <div className="space-y-10 max-w-3xl">
            {/* Competency 1 */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                Evaluarea clienților și stabilirea obiectivelor
              </h3>
              <ul className="space-y-2 text-[#444]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Evaluări inițiale: postură, mobilitate, forță, rezistență, compoziție corporală</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Identificarea dezechilibrelor musculare și limitărilor funcționale</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Obiective SMART în funcție de nivel, vârstă și istoric medical</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Chestionare PAR-Q și protocoale de siguranță</span>
                </li>
              </ul>
            </div>

            {/* Competency 2 */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                Programe de antrenament personalizate
              </h3>
              <ul className="space-y-2 text-[#444]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Planuri pentru: slăbire, tonifiere, hipertrofie, forță, rezistență</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Principiile periodizării și progresiei</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Structurarea corectă a unei ședințe (încălzire, partea principală, cooldown)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Adaptarea exercițiilor în funcție de nivelul clientului</span>
                </li>
              </ul>
            </div>

            {/* Competency 3 */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                Tehnica exercițiilor de fitness
              </h3>
              <ul className="space-y-2 text-[#444]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Exerciții cu greutăți libere, aparate și greutatea corpului</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Biomecanica mișcării și lanțurile kinetice</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Prevenirea accidentărilor prin execuție corectă și dozaj optim</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Exerciții funcționale, multiplanare și full body</span>
                </li>
              </ul>
            </div>

            {/* Competency 4 */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                Lucrul cu diferite tipologii de clienți
              </h3>
              <ul className="space-y-2 text-[#444]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Începători, intermediari și avansați</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Persoane sedentare sau supraponderale</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Clienți cu limitări articulare ușoare sau posturale</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Clienți orientați spre performanță estetică sau sportivă</span>
                </li>
              </ul>
            </div>

            {/* Competency 5 */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                Nutriție și lifestyle
              </h3>
              <ul className="space-y-2 text-[#444]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Principiile nutriției pentru fitness și controlul greutății</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Recomandări generale de alimentație sănătoasă</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Hidratarea, recuperarea și somnul</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Colaborarea cu nutriționiști și alți specialiști</span>
                </li>
              </ul>
            </div>

            {/* Competency 6 */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                Comunicare profesională
              </h3>
              <ul className="space-y-2 text-[#444]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Abilități de comunicare, motivație și coaching</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Relația antrenor–client într-un mod etic și profesionist</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Menținerea aderenței clientului la program</span>
                </li>
              </ul>
            </div>

            {/* Competency 7 */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                Cadrul legal și etic
              </h3>
              <ul className="space-y-2 text-[#444]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Responsabilitățile legale ale Instructorului Fitness</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Norme de siguranță, igienă și cod etic profesional</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Când și cum să direcționezi clientul către alți specialiști</span>
                </li>
              </ul>
            </div>

            {/* Competency 8 */}
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-3">
                Instrumente moderne și carieră
              </h3>
              <ul className="space-y-2 text-[#444]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Aplicații de tracking și planificare antrenamente</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Monitorizarea progresului și ajustarea programelor</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Construirea unui portofoliu de clienți și marketing personal</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8001F] mt-1.5 text-xs">&#9679;</span>
                  <span>Servicii 1:1, small group training sau online coaching</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16">
        <hr className="border-[#E5E5E5]" />
      </div>

      {/* Formatori */}
      <section id="formatori" className="py-16 px-4 sm:px-8 lg:px-16 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-3 font-[family-name:var(--font-unbounded)]">
            Formatorii Cursului
          </h2>
          <p className="text-lg text-[#666] mb-10 max-w-3xl">
            Echipa noastră combină experiența academică cu cea practică, având certificări internaționale și mii de ore de predare.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[#E5E5E5]">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A0A0A]">{trainer.name}</h3>
                  <p className="text-sm text-[#666] mt-0.5 leading-relaxed">
                    {trainer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16">
        <hr className="border-[#E5E5E5]" />
      </div>

      {/* Înscriere și Certificare */}
      <section id="inscriere" className="py-16 px-4 sm:px-8 lg:px-16 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-10 font-[family-name:var(--font-unbounded)]">
            Înscriere și Certificare
          </h2>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Acte necesare */}
            <div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-5 font-[family-name:var(--font-unbounded)]">
                Acte necesare
              </h3>
              <ol className="space-y-3 text-[#444]">
                <li className="flex items-start gap-3">
                  <span className="text-[#B8001F] font-bold text-sm mt-0.5 w-5 flex-shrink-0">1.</span>
                  <span>Copie certificat de naștere</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#B8001F] font-bold text-sm mt-0.5 w-5 flex-shrink-0">2.</span>
                  <span>Copie după ultima formă de învățământ absolvită (minim studii liceale)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#B8001F] font-bold text-sm mt-0.5 w-5 flex-shrink-0">3.</span>
                  <span>Copie carte de identitate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#B8001F] font-bold text-sm mt-0.5 w-5 flex-shrink-0">4.</span>
                  <span>Copie certificat de căsătorie (dacă este cazul)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#B8001F] font-bold text-sm mt-0.5 w-5 flex-shrink-0">5.</span>
                  <span><strong className="text-[#0A0A0A]">Adeverință medicală în original</strong> — care să ateste faptul că participantul este apt pentru activități sportive</span>
                </li>
              </ol>
            </div>

            {/* Examen final */}
            <div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-5 font-[family-name:var(--font-unbounded)]">
                Examen final și certificare
              </h3>
              <div className="space-y-5 text-[#444] leading-relaxed">
                <div>
                  <p className="font-semibold text-[#0A0A0A] mb-1">Format examen</p>
                  <p>{course.exam.format}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#0A0A0A] mb-1">Certificare</p>
                  <p>{course.exam.certification}</p>
                </div>
                <p className="text-[#0A0A0A] font-medium bg-[#B8001F]/5 border-l-3 border-[#B8001F] pl-4 py-3 rounded-r">
                  Certificarea este recunoscută internațional și îți permite să activezi ca profesionist în România și în Uniunea Europeană.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form */}
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-unbounded)]">
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
                      ? "Trimis cu succes!"
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
        course.id === 1 ? (
          <motion.a
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            href="https://checkout.sense4fitsummit.com/pages/index_beta?spid=prod_UBjZWMpQiKFT1k"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 bg-[#B8001F] text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:bg-[#490207] transition-all duration-300 hover:scale-105 z-40 flex items-center gap-2"
          >
            <span>Cumpără Acum</span>
            <ChevronRight size={20} />
          </motion.a>
        ) : (
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
        )
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
