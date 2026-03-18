"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Specialization } from "@/data/specializations";

interface ConfiguratorSummaryProps {
  selectedSpecs: {
    foundation: Specialization | null;
    direction: Specialization | null;
    specialization: Specialization | null;
  };
  totalPrice: number;
}

export default function ConfiguratorSummary({
  selectedSpecs,
  totalPrice,
}: ConfiguratorSummaryProps) {
  const hasSelection =
    selectedSpecs.foundation ||
    selectedSpecs.direction ||
    selectedSpecs.specialization;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-8 z-10 mx-4 sm:mx-8"
    >
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1A1A1A] to-[#222222] rounded-2xl border border-[#2A2A2A] p-6 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Selection Path */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-[#B8001F]" />
              <h3 className="text-lg font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                Parcursul tău educațional
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <AnimatePresence mode="wait">
                {selectedSpecs.foundation && (
                  <motion.span
                    key="foundation"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#B8001F]/20 border border-[#B8001F]/40 text-[#B8001F] rounded-full font-medium"
                  >
                    {selectedSpecs.foundation.title}
                  </motion.span>
                )}

                {selectedSpecs.foundation && selectedSpecs.direction && (
                  <motion.div
                    key="arrow-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <ArrowRight size={14} className="text-[#A0A0A0] sm:w-4 sm:h-4" />
                  </motion.div>
                )}

                {selectedSpecs.direction && (
                  <motion.span
                    key="direction"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#B8001F]/20 border border-[#B8001F]/40 text-[#B8001F] rounded-full font-medium"
                  >
                    {selectedSpecs.direction.title}
                  </motion.span>
                )}

                {selectedSpecs.direction && selectedSpecs.specialization && (
                  <motion.div
                    key="arrow-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <ArrowRight size={14} className="text-[#A0A0A0] sm:w-4 sm:h-4" />
                  </motion.div>
                )}

                {selectedSpecs.specialization && (
                  <motion.span
                    key="specialization"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#B8001F]/20 border border-[#B8001F]/40 text-[#B8001F] rounded-full font-medium"
                  >
                    {selectedSpecs.specialization.title}
                  </motion.span>
                )}

                {!hasSelection && (
                  <motion.span
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[#666666] italic"
                  >
                    Selectează cel puțin un curs...
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex flex-col sm:flex-row items-center sm:gap-6 w-full lg:w-auto gap-4">
            {/* Total Price */}
            <div className="text-center sm:text-right w-full sm:w-auto">
              <p className="text-[#A0A0A0] text-xs sm:text-sm mb-1">Total investiție</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={totalPrice}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-bebas-neue)]"
                >
                  {formatPrice(totalPrice)}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <motion.a
              href="#contact"
              whileHover={{ scale: hasSelection ? 1.05 : 1 }}
              whileTap={{ scale: hasSelection ? 0.95 : 1 }}
              className={`
                inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 whitespace-nowrap w-full sm:w-auto
                text-base sm:text-lg
                ${
                  hasSelection
                    ? "bg-[#B8001F] text-white hover:bg-[#490207] hover:shadow-lg hover:shadow-[#B8001F]/50 cursor-pointer"
                    : "bg-[#2A2A2A] text-[#666666] cursor-not-allowed"
                }
              `}
              style={{ pointerEvents: hasSelection ? "auto" : "none" }}
            >
              Înscrie-te acum
              <ArrowRight size={18} className="ml-2 sm:w-5 sm:h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
