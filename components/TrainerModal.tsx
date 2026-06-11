"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Instagram, X } from "lucide-react";
import { useEffect } from "react";

import type { PublicTrainer } from "@/lib/supabase/queries/public";

interface TrainerModalProps {
  trainer: PublicTrainer | null;
  onClose: () => void;
}

export default function TrainerModal({ trainer, onClose }: TrainerModalProps) {
  useEffect(() => {
    if (!trainer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [trainer, onClose]);

  return (
    <AnimatePresence>
      {trainer ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#0A0A0A] shadow-2xl ring-1 ring-white/10 grid grid-cols-1 sm:grid-cols-[260px_1fr]"
          >
            <button
              onClick={onClose}
              aria-label="Închide"
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div
              className="relative h-64 sm:h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${trainer.photo})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
              {trainer.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {trainer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[rgba(184,0,31,0.3)] border border-[rgba(184,0,31,0.5)] text-[#ff6b7a] text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wide font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {trainer.name}
              </h3>

              {trainer.bio ? (
                <p className="text-[#bbb] text-sm leading-relaxed mt-4 whitespace-pre-line">
                  {trainer.bio}
                </p>
              ) : null}

              {trainer.instagram_url ? (
                <div className="flex gap-3 mt-6">
                  <a
                    href={trainer.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#aaa] hover:text-white transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
