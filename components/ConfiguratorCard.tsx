"use client";

import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Specialization } from "@/data/specializations";

interface ConfiguratorCardProps {
  specialization: Specialization;
  isSelected: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  onInfoClick: () => void;
}

export default function ConfiguratorCard({
  specialization,
  isSelected,
  isDisabled = false,
  onClick,
  onInfoClick,
}: ConfiguratorCardProps) {
  const Icon = specialization.icon;

  return (
    <motion.div
      onClick={!isDisabled ? onClick : undefined}
      whileHover={!isDisabled ? { y: -4 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        relative w-full h-full p-8 rounded-xl transition-all duration-200 text-left flex flex-col
        ${
          isSelected
            ? "bg-[#1A1A1A] border border-[#B8001F]"
            : "bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A]"
        }
        ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Selection Indicator */}
      <div className="flex items-start justify-between mb-6">
        <div
          className={`
            w-12 h-12 rounded-lg flex items-center justify-center transition-colors
            ${isSelected ? "bg-[#B8001F]" : "bg-[#2A2A2A]"}
          `}
        >
          {isSelected ? (
            <Check size={24} className="text-white" />
          ) : (
            <Icon size={24} className="text-[#666666]" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className={`text-xs font-medium px-2 py-1 rounded ${
            isSelected ? "bg-[#B8001F]/10 text-[#B8001F]" : "bg-[#2A2A2A] text-[#666666]"
          }`}>
            {specialization.duration}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick();
            }}
            className="w-8 h-8 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] flex items-center justify-center transition-colors"
            aria-label="Informații curs"
          >
            <Info size={16} className="text-[#A0A0A0]" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
        {specialization.title}
      </h3>

      {/* Description */}
      <p className="text-[#A0A0A0] text-sm mb-6 leading-relaxed min-h-[40px] flex-1">
        {specialization.description}
      </p>

      {/* Price */}
      <div className="pt-4 border-t border-[#2A2A2A] mt-auto">
        <span className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
          {formatPrice(specialization.price)}
        </span>
      </div>
    </motion.div>
  );
}
