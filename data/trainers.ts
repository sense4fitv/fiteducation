export interface Trainer {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const trainers: Trainer[] = [
  {
    id: 1,
    name: "Flavius Turcanu",
    description: "Doctorand IEFS, Fondator Fiteducation & CRAB, Presenter internațional, Consultant",
    image: "/trainers/flavius.png",
  },
  {
    id: 2,
    name: "Bianca Margarit",
    description: "Doctor, Nutriționist, Personal trainer",
    image: "/trainers/bianca.png",
  },
  {
    id: 3,
    name: "Attila Kovacs",
    description: "Doctorand, specialist în respirație, coach de performanță certificat",
    image: "/trainers/attila.png",
  },
  {
    id: 4,
    name: "Robert Florea",
    description: "Specialist în kinetoterapie, bodybuilding, recuperare, nutriție, condiționare tactică și master trainer ISSA",
    image: "/trainers/robert.png",
  },
  {
    id: 5,
    name: "Ana Georgescu",
    description: "Specialist în educație, Presenter internațional, Master trainer",
    image: "/trainers/ana.png",
  },
  {
    id: 6,
    name: "Antonio Enache",
    description: "Fondator Sense4fit, expert în domeniul wellness, în comunicare și business",
    image: "/trainers/antonio.png",
  },
];
