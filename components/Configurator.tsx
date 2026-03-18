"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ConfiguratorCard from "./ConfiguratorCard";
import ConfiguratorSummary from "./ConfiguratorSummary";
import CourseModal from "./CourseModal";
import {
  getFoundation,
  getDirections,
  getSpecializations,
  type Specialization,
} from "@/data/specializations";

export default function Configurator() {
  const [selectedFoundation, setSelectedFoundation] =
    useState<Specialization | null>(null);
  const [selectedDirection, setSelectedDirection] =
    useState<Specialization | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<Specialization | null>(null);

  const [modalCourse, setModalCourse] = useState<Specialization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const foundation = getFoundation();
  const directions = getDirections();
  const specializations = getSpecializations();

  const selectedCourses = [
    selectedFoundation,
    selectedDirection,
    selectedSpecialization,
  ].filter(Boolean) as Specialization[];

  const totalPrice = selectedCourses.reduce(
    (sum, course) => sum + course.price,
    0
  );

  const handleToggle = (
    current: Specialization | null,
    course: Specialization,
    setter: (val: Specialization | null) => void
  ) => {
    if (current?.id === course.id) {
      setter(null);
    } else {
      setter(course);
    }
  };

  const openModal = (course: Specialization) => {
    setModalCourse(course);
    setIsModalOpen(true);
  };

  return (
    <section
      id="specializari"
      className="py-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAFA]"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A0A0A] mb-6 font-[family-name:var(--font-space-grotesk)]">
            Construiește-ți parcursul educațional
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Selectează cursurile care se potrivesc obiectivelor tale profesionale
          </p>
        </motion.div>

        {/* Dark Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#0A0A0A] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl"
        >
          <div className="space-y-16">
            {/* Step 1 - Foundation */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedFoundation ? "bg-[#B8001F]" : "bg-[#2A2A2A]"
                }`}>
                  <span className={`font-bold text-lg ${
                    selectedFoundation ? "text-white" : "text-[#666666]"
                  }`}>1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                    Fundație
                  </h3>
                  <p className="text-[#666666] text-sm">Bazele științei mișcării și antrenamentului</p>
                </div>
              </div>

              <div className="max-w-lg">
                {foundation && (
                  <ConfiguratorCard
                    specialization={foundation}
                    isSelected={selectedFoundation?.id === foundation.id}
                    onClick={() =>
                      handleToggle(selectedFoundation, foundation, setSelectedFoundation)
                    }
                    onInfoClick={() => openModal(foundation)}
                  />
                )}
              </div>
            </div>

            {/* Step 2 - Direction */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedDirection ? "bg-[#B8001F]" : "bg-[#2A2A2A]"
                }`}>
                  <span className={`font-bold text-lg ${
                    selectedDirection ? "text-white" : "text-[#666666]"
                  }`}>2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                    Direcție principală
                  </h3>
                  <p className="text-[#666666] text-sm">Personal Training sau Group Fitness</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {directions.map((direction) => (
                  <ConfiguratorCard
                    key={direction.id}
                    specialization={direction}
                    isSelected={selectedDirection?.id === direction.id}
                    onClick={() =>
                      handleToggle(selectedDirection, direction, setSelectedDirection)
                    }
                    onInfoClick={() => openModal(direction)}
                  />
                ))}
              </div>
            </div>

            {/* Step 3 - Specialization */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedSpecialization ? "bg-[#B8001F]" : "bg-[#2A2A2A]"
                }`}>
                  <span className={`font-bold text-lg ${
                    selectedSpecialization ? "text-white" : "text-[#666666]"
                  }`}>3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                    Specializare avansată
                  </h3>
                  <p className="text-[#666666] text-sm">Aprofundează un domeniu specific</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {specializations.map((spec) => (
                  <ConfiguratorCard
                    key={spec.id}
                    specialization={spec}
                    isSelected={selectedSpecialization?.id === spec.id}
                    onClick={() =>
                      handleToggle(selectedSpecialization, spec, setSelectedSpecialization)
                    }
                    onInfoClick={() => openModal(spec)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="mt-12">
          <ConfiguratorSummary
            selectedSpecs={{
              foundation: selectedFoundation,
              direction: selectedDirection,
              specialization: selectedSpecialization,
            }}
            totalPrice={totalPrice}
          />
        </div>
      </div>

      {/* Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={modalCourse}
      />
    </section>
  );
}
