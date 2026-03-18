import { Dumbbell, Users, Heart, Activity, Salad, Sparkles } from "lucide-react";

export interface Specialization {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  icon: any;
  row: 1 | 2 | 3;
  category?: "foundation" | "direction" | "specialization";
}

export const specializations: Specialization[] = [
  // Rând 1 - Foundation (mereu selectat)
  {
    id: "foundation",
    title: "Foundation",
    description: "Bazele științei mișcării, anatomie funcțională și principii de antrenament",
    duration: "6 săptămâni",
    price: 1500,
    icon: Sparkles,
    row: 1,
    category: "foundation",
  },

  // Rând 2 - Direcția principală
  {
    id: "personal-training",
    title: "Personal Training",
    description: "Specializare în antrenament individual și program design",
    duration: "8 săptămâni",
    price: 2200,
    icon: Dumbbell,
    row: 2,
    category: "direction",
  },
  {
    id: "aerobic-group",
    title: "Aerobic & Group Fitness",
    description: "Specializare în clase de grup, coregrafie și motivație",
    duration: "8 săptămâni",
    price: 2000,
    icon: Users,
    row: 2,
    category: "direction",
  },

  // Rând 3 - Specializare finală
  {
    id: "strength-conditioning",
    title: "Strength & Conditioning",
    description: "Forță, putere și periodizare avansată",
    duration: "6 săptămâni",
    price: 1800,
    icon: Activity,
    row: 3,
    category: "specialization",
  },
  {
    id: "nutrition",
    title: "Nutriție Sportivă",
    description: "Planuri nutriționale și suplimentare",
    duration: "6 săptămâni",
    price: 1600,
    icon: Salad,
    row: 3,
    category: "specialization",
  },
  {
    id: "functional-training",
    title: "Antrenament Funcțional",
    description: "Mobilitate, stabilitate și mișcare funcțională",
    duration: "6 săptămâni",
    price: 1700,
    icon: Heart,
    row: 3,
    category: "specialization",
  },
  {
    id: "recovery-stretching",
    title: "Recuperare & Stretching",
    description: "Tehnici de recuperare și flexibilitate",
    duration: "6 săptămâni",
    price: 1500,
    icon: Sparkles,
    row: 3,
    category: "specialization",
  },
];

// Helper functions
export const getFoundation = () =>
  specializations.find((s) => s.category === "foundation");

export const getDirections = () =>
  specializations.filter((s) => s.category === "direction");

export const getSpecializations = () =>
  specializations.filter((s) => s.category === "specialization");
