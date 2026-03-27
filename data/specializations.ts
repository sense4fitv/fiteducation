import { Dumbbell, Users, Heart, Activity, Sparkles } from "lucide-react";

export interface Specialization {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  icon: any;
  row: 1 | 2 | 3;
  category?: "foundation" | "direction" | "specialization";
  comingSoon?: boolean;
}

export const specializations: Specialization[] = [
  // Fundație - col 1
  {
    id: "personal-training",
    title: "Personal training certificat",
    description: "Specializare în antrenament individual și program design",
    duration: "18 Iulie",
    price: 7900,
    icon: Dumbbell,
    row: 1,
    category: "foundation",
  },
  {
    id: "aerobic-group",
    title: "Instructor Aerobic & Group Fitness",
    description: "Specializare în clase de grup, coregrafie și motivație",
    duration: "18 Iulie",
    price: 7900,
    icon: Users,
    row: 1,
    category: "foundation",
    comingSoon: true,
  },

  // Workshop-uri si specializari - col 2
  {
    id: "certificare-profesionala",
    title: "Certificare Profesională",
    description: "Curs cu examinare de minister. Participare condiționată de finalizare modul 1+2",
    duration: "16 oct",
    price: 2000,
    icon: Sparkles,
    row: 3,
    category: "specialization",
  },
  {
    id: "vipr",
    title: "VIPR",
    description: "Vitality, Performance, Reconditioning",
    duration: "TBA",
    price: 550,
    icon: Activity,
    row: 3,
    category: "specialization",
  },
  {
    id: "crab",
    title: "CRAB",
    description: "Functional. Reimaginat",
    duration: "TBA",
    price: 650,
    icon: Heart,
    row: 3,
    category: "specialization",
  },
];

// Helper functions
export const getFoundations = () =>
  specializations.filter((s) => s.category === "foundation");

export const getDirections = () =>
  specializations.filter((s) => s.category === "direction");

export const getSpecializations = () =>
  specializations.filter((s) => s.category === "specialization");
