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
    duration: "18 iulie",
    price: 2000,
    icon: Sparkles,
    row: 1,
    category: "foundation",
  },

  // Rând 2 - Direcția principală
  {
    id: "personal-training",
    title: "Personal Training",
    description: "Specializare în antrenament individual și program design",
    duration: "1 August",
    price: 3800,
    icon: Dumbbell,
    row: 2,
    category: "direction",
  },
  {
    id: "aerobic-group",
    title: "Aerobic / Group Fitness",
    description: "Specializare în clase de grup, coregrafie și motivație",
    duration: "TBA",
    price: 3200,
    icon: Users,
    row: 2,
    category: "direction",
  },

  // Rând 3 - Specializare finală
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
export const getFoundation = () =>
  specializations.find((s) => s.category === "foundation");

export const getDirections = () =>
  specializations.filter((s) => s.category === "direction");

export const getSpecializations = () =>
  specializations.filter((s) => s.category === "specialization");
