"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { trainers } from "@/data/trainers";
import TrainerPanel from "./TrainerPanel";
import TrainerMobileCard from "./TrainerMobileCard";

export default function TrainersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 260 + 12; // min-w + gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveDot(Math.min(index, trainers.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="traineri" className="py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0A0A0A] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[#B8001F] text-xs uppercase tracking-[3px] font-semibold mb-3"
            >
              Echipa noastră
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-white font-[family-name:var(--font-space-grotesk)]"
            >
              Traineri de elită
            </motion.h2>
          </div>

          {/* Desktop: Expanding Panels */}
          <div className="hidden lg:flex gap-1.5">
            {trainers.map((trainer, index) => (
              <TrainerPanel
                key={trainer.id}
                trainer={trainer}
                isActive={activeIndex === index}
                onActivate={() => setActiveIndex(index)}
              />
            ))}
          </div>

          {/* Mobile: Horizontal Scroll */}
          <div className="lg:hidden">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-4"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              }}
            >
              {trainers.map((trainer, index) => (
                <TrainerMobileCard
                  key={trainer.id}
                  trainer={trainer}
                  index={index}
                />
              ))}
            </div>

            {/* Scroll Indicator Dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {trainers.map((_, index) => (
                <div
                  key={index}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    activeDot === index
                      ? "w-5 bg-[#B8001F]"
                      : "w-2 bg-[#333]"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
