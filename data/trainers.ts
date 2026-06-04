export interface Trainer {
  id: number;
  name: string;
  description: string;
  image: string;
  bio: string;
  tags: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export const trainers: Trainer[] = [
  {
    id: 1,
    name: "Flavius Turcanu",
    description: "Doctorand IEFS, Fondator Fiteducation & CRAB, Presenter internațional, Consultant",
    image: "/trainers/flavius.png",
    bio: "Cu o experiență de peste 15 ani în industria fitness, Flavius este fondatorul Fiteducation și CRAB. Presenter internațional și consultant pentru branduri de top, el aduce o viziune inovatoare în educația fitness din România.",
    tags: ["Fondator", "Consulting", "Presenter"],
    socialLinks: {
      instagram: "https://instagram.com/flavius.turcanu",
      facebook: "https://facebook.com/flavius.turcanu",
      linkedin: "https://linkedin.com/in/flavius-turcanu",
    },
  },
  {
    id: 2,
    name: "Bianca Margarit",
    description: "Doctor, Nutriționist, Personal trainer",
    image: "/trainers/bianca.png",
    bio: "Bianca combină expertiza medicală cu pasiunea pentru nutriție și fitness. Ca doctor și nutriționist certificat, oferă o perspectivă științifică asupra antrenamentului și alimentației sănătoase.",
    tags: ["Nutriție", "Medicină", "Personal Training"],
    socialLinks: {
      instagram: "https://instagram.com/bianca.margarit",
    },
  },
  {
    id: 3,
    name: "Attila Kovacs",
    description: "Doctorand, specialist în respirație, coach de performanță certificat",
    image: "/trainers/attila.png",
    bio: "Attila este un specialist în tehnici de respirație și coaching de performanță. Ca doctorand, îmbină cercetarea academică cu aplicații practice pentru optimizarea performanței sportive.",
    tags: ["Respirație", "Performanță", "Cercetare"],
    socialLinks: {
      instagram: "https://instagram.com/attila.kovacs",
      linkedin: "https://linkedin.com/in/attila-kovacs",
    },
  },
  {
    id: 4,
    name: "Robert Florea",
    description: "Specialist în kinetoterapie, bodybuilding, recuperare, nutriție, condiționare tactică și master trainer ISSA",
    image: "/trainers/robert.png",
    bio: "Robert aduce o expertiză vastă în kinetoterapie, bodybuilding și recuperare. Ca master trainer ISSA, el este specializat în condiționare tactică și programe de nutriție personalizate.",
    tags: ["Kinetoterapie", "Bodybuilding", "ISSA Master"],
    socialLinks: {
      instagram: "https://instagram.com/robert.florea",
      facebook: "https://facebook.com/robert.florea",
    },
  },
  {
    id: 5,
    name: "Ana Georgescu",
    description: "Specialist în educație, Presenter internațional, Master trainer",
    image: "/trainers/ana.png",
    bio: "Ana este un master trainer cu experiență internațională în prezentări și educație fitness. Specializată în metodologii moderne de predare, ea formează noua generație de profesioniști în fitness.",
    tags: ["Educație", "Presenter", "Master Trainer"],
    socialLinks: {
      instagram: "https://instagram.com/ana.georgescu",
    },
  },
  {
    id: 6,
    name: "Antonio Enache",
    description: "Fondator Sense4fit, expert în domeniul wellness, în comunicare și business",
    image: "/trainers/antonio.png",
    bio: "Antonio este fondatorul Sense4fit și un expert recunoscut în wellness, comunicare și business. El ajută profesioniștii din fitness să-și dezvolte abilitățile de business și comunicare.",
    tags: ["Wellness", "Business", "Comunicare"],
    socialLinks: {
      instagram: "https://instagram.com/antonio.enache",
      facebook: "https://facebook.com/antonio.enache",
      linkedin: "https://linkedin.com/in/antonio-enache",
    },
  },
];
