"use client";

import { motion } from "framer-motion";
import type { Trainer } from "@/data/trainers";

interface TrainerCardProps {
  trainer: Trainer;
  index: number;
}

export default function TrainerCard({ trainer, index }: TrainerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-[#B8001F]/50 transition-all duration-300 h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-80 overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url(${trainer.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent" />
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#B8001F]/80 via-[#B8001F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
          {trainer.name}
        </h3>
        <p className="text-[#A0A0A0] text-sm leading-relaxed line-clamp-3">{trainer.description}</p>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl shadow-lg shadow-[#B8001F]/20" />
      </div>
    </motion.div>
  );
}
