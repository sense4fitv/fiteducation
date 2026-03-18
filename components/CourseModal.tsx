"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, User, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Specialization } from "@/data/specializations";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Specialization | null;
}

// Mock data pentru traineri și detalii - în viitor va veni din API
const getCourseDetails = (courseId: string) => {
  const trainers: Record<string, string> = {
    foundation: "Prof. Alexandru Popescu",
    "personal-training": "Prof. Andrei Dumitrescu",
    "aerobic-group": "Prof. Maria Ionescu",
    "strength-conditioning": "Prof. Alexandru Popescu",
    nutrition: "Prof. Elena Vasilescu",
    "functional-training": "Prof. Cristian Marinescu",
    "recovery-stretching": "Prof. Diana Georgescu",
  };

  const benefits: Record<string, string[]> = {
    foundation: [
      "Înțelegerea anatomiei și fiziologiei umane",
      "Principii fundamentale ale antrenamentului",
      "Știința mișcării și biomecanica",
      "Certificare recunoscută internațional",
    ],
    "personal-training": [
      "Tehnici avansate de evaluare a clienților",
      "Program design personalizat",
      "Coaching și motivație",
      "Business skills pentru traineri",
    ],
    "aerobic-group": [
      "Coregrafie și structură clase de grup",
      "Tehnici de motivare în grup",
      "Muzică și timing",
      "Management clase diverse",
    ],
    "strength-conditioning": [
      "Periodizare și program design avansat",
      "Tehnici de dezvoltare a forței",
      "Prevenirea accidentărilor",
      "Monitorizare performanță",
    ],
    nutrition: [
      "Macro și micronutrienți",
      "Planuri nutriționale personalizate",
      "Suplimentare sportivă",
      "Nutriție pentru performanță",
    ],
    "functional-training": [
      "Pattern-uri fundamentale de mișcare",
      "Mobilitate și stabilitate",
      "Antrenament funcțional aplicat",
      "Echipament specializat",
    ],
    "recovery-stretching": [
      "Tehnici de recuperare activă și pasivă",
      "Stretching și flexibilitate",
      "Foam rolling și self-myofascial release",
      "Prevenirea overtraining-ului",
    ],
  };

  return {
    trainer: trainers[courseId] || "Echipa de traineri",
    benefits: benefits[courseId] || [],
  };
};

export default function CourseModal({
  isOpen,
  onClose,
  course,
}: CourseModalProps) {
  if (!course) return null;

  const details = getCourseDetails(course.id);
  const Icon = course.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1A1A1A] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2A2A2A]"
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#2A2A2A] p-6 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-[#B8001F] flex items-center justify-center flex-shrink-0">
                    <Icon size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 font-[family-name:var(--font-space-grotesk)]">
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

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Quick Info - Clean Layout */}
                <div className="flex items-center justify-between py-4 border-b border-[#2A2A2A]">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-[#666666]" />
                    <div>
                      <p className="text-xs text-[#666666] mb-0.5">Durată</p>
                      <p className="text-white font-semibold">{course.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User size={18} className="text-[#666666]" />
                    <div>
                      <p className="text-xs text-[#666666] mb-0.5">Trainer</p>
                      <p className="text-white font-semibold">{details.trainer}</p>
                    </div>
                  </div>
                </div>

                {/* Price - Simple */}
                <div className="py-6 border-b border-[#2A2A2A]">
                  <p className="text-sm text-[#666666] mb-2">Investiție</p>
                  <p className="text-5xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                    {formatPrice(course.price)}
                  </p>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)]">
                    Ce vei învăța
                  </h3>
                  <ul className="space-y-4">
                    {details.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B8001F] mt-2 flex-shrink-0" />
                        <span className="text-[#A0A0A0] leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-4 border border-[#2A2A2A] text-white rounded-xl font-semibold hover:bg-[#2A2A2A] transition-colors"
                  >
                    Închide
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Navigate to course page
                      console.log(`Navigate to course: ${course.id}`);
                    }}
                    className="flex-1 px-6 py-4 bg-[#B8001F] text-white rounded-xl font-semibold hover:bg-[#490207] transition-colors flex items-center justify-center gap-2"
                  >
                    Mai multe detalii
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
