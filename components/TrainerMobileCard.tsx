"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

import type { PublicTrainer } from "@/lib/supabase/queries/public";

interface TrainerMobileCardProps {
  trainer: PublicTrainer;
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
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${trainer.photo})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        {trainer.tags.length > 0 && (
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
        )}

        <h3 className="text-lg font-extrabold text-white">{trainer.name}</h3>

        {trainer.credentials ? (
          <p className="text-[#B8001F] text-[10px] font-semibold uppercase tracking-wider mt-1">
            {trainer.credentials}
          </p>
        ) : null}

        {trainer.bio ? (
          <p className="text-[#999] text-[10px] leading-relaxed mt-2 line-clamp-3">
            {trainer.bio}
          </p>
        ) : null}

        {trainer.instagram_url ? (
          <div className="flex gap-2 mt-3">
            <a
              href={trainer.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#aaa]"
            >
              <Instagram size={12} />
            </a>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
