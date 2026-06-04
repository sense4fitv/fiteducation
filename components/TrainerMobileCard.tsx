"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import type { Trainer } from "@/data/trainers";

interface TrainerMobileCardProps {
  trainer: Trainer;
  index: number;
}

export default function TrainerMobileCard({
  trainer,
  index,
}: TrainerMobileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="min-w-[260px] h-[340px] rounded-2xl overflow-hidden relative flex-shrink-0"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${trainer.image})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {trainer.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[rgba(184,0,31,0.3)] border border-[rgba(184,0,31,0.5)] text-[#ff6b7a] text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wide font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Name */}
        <h3 className="text-lg font-extrabold text-white">{trainer.name}</h3>

        {/* Credentials */}
        <p className="text-[#B8001F] text-[10px] font-semibold uppercase tracking-wider mt-1">
          {trainer.description}
        </p>

        {/* Bio */}
        <p className="text-[#999] text-[10px] leading-relaxed mt-2 line-clamp-3">
          {trainer.bio}
        </p>

        {/* Social Links */}
        {trainer.socialLinks && (
          <div className="flex gap-2 mt-3">
            {trainer.socialLinks.instagram && (
              <a
                href={trainer.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#aaa]"
              >
                <Instagram size={12} />
              </a>
            )}
            {trainer.socialLinks.facebook && (
              <a
                href={trainer.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#aaa]"
              >
                <Facebook size={12} />
              </a>
            )}
            {trainer.socialLinks.linkedin && (
              <a
                href={trainer.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#aaa]"
              >
                <Linkedin size={12} />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
