"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { courses } from "@/data/courses";

export default function HeroSlider() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="pt-32 pb-12 px-4 sm:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[1600px] mx-auto bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-2xl"
      >
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet hero-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active hero-bullet-active",
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
          className="hero-swiper"
        >
          {courses.map((course, index) => (
            <SwiperSlide key={course.id}>
              <div className="relative h-[585px] sm:h-[650px] lg:h-[715px]">
                {/* Background Image with Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-${
                      [
                        "1534438327276-14e5300c3a48?w=1600", // Personal Trainer
                        "1518611012118-696072aa579a?w=1600", // Aerobic
                        "1517838277536-f5f99be501cd?w=1600", // Functional
                      ][index]
                    })`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center px-8 sm:px-12 lg:px-20">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-2xl"
                  >
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8001F]/20 border border-[#B8001F]/40 rounded-full mb-6"
                    >
                      <Clock size={16} className="text-[#B8001F]" />
                      <span className="text-white text-sm font-medium">
                        {course.duration}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-[family-name:var(--font-unbounded)]"
                    >
                      {course.title}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-lg sm:text-xl text-[#A0A0A0] mb-8 leading-relaxed"
                    >
                      {course.description}
                    </motion.p>

                    {/* CTA Button */}
                    {course.duration === "TBA" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="inline-flex items-center justify-center px-8 py-4 bg-[#A0A0A0]/30 text-white rounded-full font-semibold text-lg cursor-not-allowed"
                      >
                        Coming Soon
                      </motion.div>
                    ) : (
                      <motion.a
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        href={`/curs/${course.id}`}
                        className="inline-flex items-center justify-center px-8 py-4 bg-[#B8001F] text-white rounded-full font-semibold text-lg hover:bg-[#490207] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#B8001F]/50"
                      >
                        Descoperă cursul
                      </motion.a>
                    )}
                  </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                  <motion.div
                    key={`progress-${index}-${activeIndex}`}
                    initial={{ width: "0%" }}
                    animate={{
                      width: activeIndex === index ? "100%" : "0%",
                    }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-[#B8001F]"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Styles */}
        <style jsx global>{`
          .hero-swiper .swiper-pagination {
            bottom: 24px !important;
            display: flex;
            justify-content: center;
            gap: 8px;
          }

          .hero-bullet {
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.3);
            opacity: 1;
            transition: all 0.3s ease;
          }

          .hero-bullet-active {
            background: #b8001f;
            width: 32px;
            border-radius: 6px;
          }
        `}</style>
      </motion.div>
    </section>
  );
}
