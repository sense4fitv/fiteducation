"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import { trainers } from "@/data/trainers";
import TrainerCard from "./TrainerCard";

// Unsplash images for trainers
const trainerImages = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
  "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
];

export default function TrainersSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  const trainersWithImages = trainers.map((trainer, index) => ({
    ...trainer,
    image: trainerImages[index % trainerImages.length],
  }));

  return (
    <section id="traineri" className="py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1600px] mx-auto">
        {/* Dark Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0A0A0A] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]"
            >
              Echipa noastră de traineri
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-[#A0A0A0] max-w-2xl mx-auto"
            >
              Profesioniști cu experiență în fitness și educație, gata să te
              ghideze în cariera ta
            </motion.p>
          </div>

          {/* Swiper Container */}
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1.2}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 32,
                },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="trainers-swiper"
            >
              {trainersWithImages.map((trainer, index) => (
                <SwiperSlide key={trainer.id}>
                  <TrainerCard trainer={trainer} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons - Desktop Only */}
            <div className="hidden lg:block">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-[#B8001F] hover:bg-[#490207] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-[#B8001F] hover:bg-[#490207] rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Scroll Hint */}
          <div className="lg:hidden text-center mt-8">
            <p className="text-[#666666] text-sm italic">
              Swipe pentru a vedea mai mulți traineri →
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
