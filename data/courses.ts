export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
}

export const courses: Course[] = [
  {
    id: 1,
    title: "Personal Trainer Certificat",
    description: "Devino antrenor personal certificat internațional",
    duration: "16 săptămâni",
    image: "/images/courses/personal-trainer.jpg",
  },
  {
    id: 2,
    title: "Instructor Aerobic & Group Fitness",
    description: "Specializare completă în clase de grup",
    duration: "12 săptămâni",
    image: "/images/courses/aerobic.jpg",
  },
  {
    id: 3,
    title: "Nutriție Sportivă",
    description: "Fundamentele nutriției pentru performanță",
    duration: "8 săptămâni",
    image: "/images/courses/nutrition.jpg",
  },
  {
    id: 4,
    title: "Antrenament Funcțional",
    description: "Tehnici avansate de antrenament funcțional",
    duration: "10 săptămâni",
    image: "/images/courses/functional.jpg",
  },
];
