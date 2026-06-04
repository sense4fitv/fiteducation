"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, X } from "lucide-react";

import { pickCourseIcon } from "@/lib/course-icons";
import { formatPrice } from "@/lib/format";
import type { SpecializationVM } from "@/lib/specialization-vm";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: SpecializationVM | null;
}

export default function CourseModal({
  isOpen,
  onClose,
  course,
}: CourseModalProps) {
  if (!course) return null;
  const Icon = pickCourseIcon(course.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1A1A1A] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2A2A2A]"
            >
              <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#2A2A2A] p-6 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-[#B8001F] flex items-center justify-center flex-shrink-0">
                    <Icon size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 font-[family-name:var(--font-unbounded)]">
                      {course.title}
                    </h2>
                    <p className="text-[#A0A0A0] text-sm">
                      {course.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                >
                  <X size={24} className="text-[#A0A0A0]" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 py-4 border-b border-[#2A2A2A]">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-[#666666] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#666666] mb-0.5">
                        Data început
                      </p>
                      <p className="text-white font-semibold">
                        {course.duration}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-6 border-b border-[#2A2A2A]">
                  <p className="text-sm text-[#666666] mb-2">Investiție</p>
                  <p className="text-5xl font-bold text-white font-[family-name:var(--font-unbounded)]">
                    {formatPrice(course.price, course.currency)}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-4 border border-[#2A2A2A] text-white rounded-xl font-semibold hover:bg-[#2A2A2A] transition-colors"
                  >
                    Închide
                  </button>
                  <Link
                    href={`/curs/${course.id}`}
                    className="flex-1 px-6 py-4 bg-[#B8001F] text-white rounded-xl font-semibold hover:bg-[#490207] transition-colors flex items-center justify-center gap-2"
                  >
                    Mai multe detalii
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
