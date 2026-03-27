"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, ChevronDown, ArrowRight, X } from "lucide-react";
import ConfiguratorCard from "./ConfiguratorCard";
import ConfiguratorSummary from "./ConfiguratorSummary";
import CourseModal from "./CourseModal";
import {
  getFoundations,
  getSpecializations,
  type Specialization,
} from "@/data/specializations";
import { formatPrice } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";

export default function Configurator() {
  const swiperRef = useRef<SwiperType | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const [selectedFoundation, setSelectedFoundation] =
    useState<Specialization | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<Specialization | null>(null);

  const [modalCourse, setModalCourse] = useState<Specialization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyBarDismissed, setStickyBarDismissed] = useState(false);

  const foundations = getFoundations();
  const specializations = getSpecializations();

  const selectedCourses = [
    selectedFoundation,
    selectedSpecialization,
  ].filter(Boolean) as Specialization[];

  const totalPrice = selectedCourses.reduce(
    (sum, course) => sum + course.price,
    0
  );

  const handleToggle = (
    current: Specialization | null,
    course: Specialization,
    setter: (val: Specialization | null) => void
  ) => {
    if (current?.id === course.id) {
      setter(null);
    } else {
      setter(course);
    }
  };

  const openModal = (course: Specialization) => {
    setModalCourse(course);
    setIsModalOpen(true);
  };

  // Detect when summary section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when summary is NOT visible, we have selections, and it hasn't been dismissed
        setShowStickyBar(!entry.isIntersecting && selectedCourses.length > 0 && !stickyBarDismissed);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px", // Trigger slightly before reaching bottom
      }
    );

    if (summaryRef.current) {
      observer.observe(summaryRef.current);
    }

    return () => {
      if (summaryRef.current) {
        observer.unobserve(summaryRef.current);
      }
    };
  }, [selectedCourses.length, stickyBarDismissed]);

  return (
    <section
      id="specializari"
      className="py-12 px-4 sm:px-8 lg:px-16 bg-[#FAFAFA]"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-space-grotesk)]">
            Programa Modulară
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Folosește configuratorul și construiește propriul parcurs educațional conform obiectivelor tale profesionale
          </p>
        </motion.div>

        {/* Dark Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#0A0A0A] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-10">
            {/* Col 1 - Fundatie */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedFoundation ? "bg-[#B8001F]" : "bg-[#2A2A2A]"
                }`}>
                  <span className={`font-bold text-lg ${
                    selectedFoundation ? "text-white" : "text-[#666666]"
                  }`}>1</span>
                </div>
                <h3 className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                  Fundație
                </h3>
              </div>

              <div className="flex flex-col gap-4 lg:h-[592px]">
                {foundations.map((foundation) => (
                  <div key={foundation.id} className="flex-1">
                    <ConfiguratorCard
                      specialization={foundation}
                      isSelected={selectedFoundation?.id === foundation.id}
                      onClick={() => handleToggle(selectedFoundation, foundation, setSelectedFoundation)}
                      onInfoClick={() => openModal(foundation)}
                      hideInfo={foundation.comingSoon}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2 - Workshop-uri si specializari */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedSpecialization ? "bg-[#B8001F]" : "bg-[#2A2A2A]"
                }`}>
                  <span className={`font-bold text-lg ${
                    selectedSpecialization ? "text-white" : "text-[#666666]"
                  }`}>2</span>
                </div>
                <h3 className="text-xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                  Workshop-uri și specializări
                </h3>
              </div>

              {/* Desktop - Vertical Scroll */}
              <div className="hidden lg:block relative">
                <div className="max-h-[592px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-[#B8001F] scrollbar-track-[#2A2A2A]">
                  {specializations.map((spec) => (
                    <ConfiguratorCard
                      key={spec.id}
                      specialization={spec}
                      isSelected={selectedSpecialization?.id === spec.id}
                      onClick={() =>
                        handleToggle(selectedSpecialization, spec, setSelectedSpecialization)
                      }
                      onInfoClick={() => openModal(spec)}
                    />
                  ))}
                </div>

                {/* Scroll Indicator */}
                {specializations.length > 2 && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent pointer-events-none flex items-end justify-center pb-2">
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <span className="text-xs text-[#666666] font-medium">
                        Mai multe
                      </span>
                      <ChevronDown size={18} className="text-[#B8001F]" />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Mobile/Tablet - Horizontal Swiper */}
              <div className="lg:hidden relative">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={1.2}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 16,
                    },
                  }}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  className="specializations-swiper"
                >
                  {specializations.map((spec) => (
                    <SwiperSlide key={spec.id}>
                      <ConfiguratorCard
                        specialization={spec}
                        isSelected={selectedSpecialization?.id === spec.id}
                        onClick={() =>
                          handleToggle(selectedSpecialization, spec, setSelectedSpecialization)
                        }
                        onInfoClick={() => openModal(spec)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Navigation Arrows - Mobile */}
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-[#B8001F] hover:bg-[#490207] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-[#B8001F] hover:bg-[#490207] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <div ref={summaryRef} className="mt-8">
          <ConfiguratorSummary
            selectedSpecs={{
              foundation: selectedFoundation,
              specialization: selectedSpecialization,
            }}
            totalPrice={totalPrice}
          />
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1A1A1A] to-[#222222] border-t border-[#2A2A2A] shadow-2xl"
          >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 relative">
              {/* Close Button */}
              <button
                onClick={() => setStickyBarDismissed(true)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#2A2A2A] hover:bg-[#B8001F] text-[#A0A0A0] hover:text-white transition-all duration-200 group"
                aria-label="Închide"
              >
                <X size={16} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>

              <div className="flex items-center justify-between gap-4 pr-8 sm:pr-10">
                {/* Left: Title */}
                <div className="flex-shrink-0">
                  <h3 className="text-base sm:text-lg font-bold text-white font-[family-name:var(--font-bebas-neue)] tracking-wide">
                    Parcursul tău educațional
                  </h3>
                </div>

                {/* Right: Price & CTA */}
                <div className="flex items-center gap-3 sm:gap-6">
                  {/* Price */}
                  <div className="text-right">
                    <p className="text-[#A0A0A0] text-xs sm:text-sm">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-bebas-neue)]">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#B8001F] text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-[#490207] hover:shadow-lg hover:shadow-[#B8001F]/50 whitespace-nowrap"
                  >
                    Înscrie-te
                    <ArrowRight size={18} className="ml-2 hidden sm:inline" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={modalCourse}
      />
    </section>
  );
}
