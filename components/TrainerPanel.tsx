"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Instagram } from "lucide-react";

import type { PublicTrainer } from "@/lib/supabase/queries/public";

interface TrainerPanelProps {
  trainer: PublicTrainer;
  isActive: boolean;
  onActivate: () => void;
}

const contentVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function TrainerPanel({
  trainer,
  isActive,
  onActivate,
}: TrainerPanelProps) {
  return (
    <motion.div
      layout
      animate={{ flex: isActive ? 3.5 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={onActivate}
      className="relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${trainer.photo})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />

      {!isActive && (
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
          <span
            className="text-white text-xs font-bold tracking-widest uppercase"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {trainer.name.split(" ")[0]} {trainer.name.split(" ")[1]?.[0]}.
          </span>
        </div>
      )}

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            {trainer.tags.length > 0 && (
              <motion.div
                custom={0}
                variants={contentVariants}
                className="flex flex-wrap gap-2 mb-3"
              >
                {trainer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[rgba(184,0,31,0.3)] border border-[rgba(184,0,31,0.5)] text-[#ff6b7a] text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wide font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.h3
              custom={1}
              variants={contentVariants}
              className="text-xl font-extrabold text-white tracking-tight"
            >
              {trainer.name}
            </motion.h3>

            {trainer.credentials ? (
              <motion.p
                custom={2}
                variants={contentVariants}
                className="text-[#B8001F] text-xs font-semibold uppercase tracking-wider mt-1"
              >
                {trainer.credentials}
              </motion.p>
            ) : null}

            {trainer.bio ? (
              <motion.p
                custom={3}
                variants={contentVariants}
                className="text-[#999] text-sm leading-relaxed mt-3 max-w-[320px]"
              >
                {trainer.bio}
              </motion.p>
            ) : null}

            {trainer.instagram_url ? (
              <motion.div
                custom={4}
                variants={contentVariants}
                className="flex gap-3 mt-4"
              >
                <a
                  href={trainer.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#aaa] hover:text-white transition-colors"
                >
                  <Instagram size={14} />
                </a>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
