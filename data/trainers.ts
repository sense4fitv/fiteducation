export interface Trainer {
  id: number;
  name: string;
  specialization: string;
  image: string;
  bio?: string;
}

export const trainers: Trainer[] = [
  {
    id: 1,
    name: "Alexandru Popescu",
    specialization: "Strength & Conditioning",
    image: "/images/trainers/alexandru.jpg",
    bio: "Expert în antrenament de forță cu peste 10 ani experiență",
  },
  {
    id: 2,
    name: "Maria Ionescu",
    specialization: "Aerobic & Group Fitness",
    image: "/images/trainers/maria.jpg",
    bio: "Instructor certificat cu pasiune pentru clasele de grup",
  },
  {
    id: 3,
    name: "Andrei Dumitrescu",
    specialization: "Personal Training",
    image: "/images/trainers/andrei.jpg",
    bio: "Antrenor personal cu specializare în transformări corporale",
  },
  {
    id: 4,
    name: "Elena Vasilescu",
    specialization: "Nutriție Sportivă",
    image: "/images/trainers/elena.jpg",
    bio: "Nutriționist sportiv certificat internațional",
  },
  {
    id: 5,
    name: "Cristian Marinescu",
    specialization: "Antrenament Funcțional",
    image: "/images/trainers/cristian.jpg",
    bio: "Specialist în mișcare funcțională și mobilitate",
  },
  {
    id: 6,
    name: "Diana Georgescu",
    specialization: "Recuperare & Stretching",
    image: "/images/trainers/diana.jpg",
    bio: "Expert în recuperare post-antrenament și flexibilitate",
  },
];
