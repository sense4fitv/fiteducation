export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  price: string;
  trainer: string;
  minEducation: string;
  slug: string;
  level: string;
  rating: number;
  studentsCount: number;
  nextStartDate: string;
  spotsLeft: number;
  fullDescription: string;
  highlights: string[];
  included: string[];
  testimonials: {
    name: string;
    role: string;
    text: string;
    image: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  requirements: {
    documents: string[];
    fees: {
      inscription: string;
      monthly: string;
      total: string;
    };
  };
  curriculum: {
    modules: {
      title: string;
      topics: string[];
    }[];
    schedule: string;
  };
  trainers: {
    name: string;
    role: string;
    bio: string;
    image: string;
  }[];
  exam: {
    format: string;
    duration: string;
    passingGrade: string;
    certification: string;
  };
}

export const courses: Course[] = [
  {
    id: 1,
    title: "Personal Trainer Certificat",
    description: "Devino antrenor personal certificat internațional",
    duration: "16 săptămâni",
    image: "/images/courses/personal-trainer.jpg",
    price: "3.500 RON",
    trainer: "Alexandru Popescu",
    minEducation: "Liceu",
    slug: "personal-trainer-certificat",
    level: "Începător - Intermediar",
    rating: 4.9,
    studentsCount: 347,
    nextStartDate: "15 Aprilie 2026",
    spotsLeft: 8,
    highlights: [
      "Certificare internațională EREPS nivel 3",
      "Experiență practică hands-on în sală reală",
      "Suport post-curs și mentorat 6 luni",
      "Acces la comunitatea exclusivă de absolvenți",
    ],
    included: [
      "16 săptămâni de curs intensiv",
      "Materiale de curs complete (digital + print)",
      "Certificare EREPS Nivel 3",
      "Acces la sală pentru practică",
      "6 luni mentorat post-curs",
      "Acces la job board exclusiv",
    ],
    testimonials: [
      {
        name: "Ana-Maria Popescu",
        role: "Absolventă 2025 - Antrenor Personal",
        text: "Cel mai bun curs pe care l-am făcut! Trainerii sunt profesioniști, materialele sunt actualizate, și am reușit să îmi găsesc job imediat după absolvire.",
        image: "/images/testimonials/ana.jpg",
      },
      {
        name: "Mihai Ionescu",
        role: "Absolvent 2024 - Studio Propriu",
        text: "Am pornit de la zero și acum dețin propriul studio. Cursul mi-a oferit nu doar cunoștințe tehnice, ci și skills de business esențiale.",
        image: "/images/testimonials/mihai.jpg",
      },
    ],
    faq: [
      {
        question: "Pot urma cursul dacă nu am experiență în fitness?",
        answer:
          "Da, absolut! Cursul este conceput pentru începători. Începem cu bazele și construim gradual cunoștințele până la nivel avansat.",
      },
      {
        question: "Certificarea este recunoscută internațional?",
        answer:
          "Da, vei primi certificare EREPS Nivel 3, recunoscută în România și în toate țările UE, permițându-ți să activezi ca antrenor personal certificat.",
      },
      {
        question: "Pot lucra în timp ce urmez cursul?",
        answer:
          "Da, programul este structurat seara și weekend pentru a permite cursanților să lucreze în timpul zilei. Cursurile sunt Luni-Vineri 18:00-21:00 și Sâmbătă 10:00-14:00.",
      },
      {
        question: "Există opțiuni de plată în rate?",
        answer:
          "Da, oferim plată în rate fără dobândă. Poți plăti taxa de înscriere (500 RON) și apoi 4 rate lunare de 750 RON fiecare.",
      },
    ],
    fullDescription:
      "Acest curs intensiv te va pregăti să devii un antrenor personal certificat internațional. Vei învăța fundamentele științifice ale antrenamentului, tehnici avansate de coaching, nutriție sportivă, și managementul clienților. La finalul cursului vei primi certificare recunoscută internațional.",
    requirements: {
      documents: [
        "Copie diplomă de bacalaureat",
        "Copie carte de identitate",
        "Certificat medical",
        "2 fotografii tip buletin",
      ],
      fees: {
        inscription: "500 RON",
        monthly: "750 RON x 4 luni",
        total: "3.500 RON",
      },
    },
    curriculum: {
      modules: [
        {
          title: "Anatomie și Fiziologie",
          topics: [
            "Sistemul muscular și scheletului",
            "Sisteme energetice",
            "Adaptări fiziologice la efort",
          ],
        },
        {
          title: "Metodologia Antrenamentului",
          topics: [
            "Principiile antrenamentului",
            "Periodizare și planificare",
            "Tehnici de antrenament",
          ],
        },
        {
          title: "Nutriție Sportivă",
          topics: [
            "Macronutrienți și micronutrienți",
            "Planuri alimentare personalizate",
            "Suplimente sportive",
          ],
        },
        {
          title: "Practică și Management Clienți",
          topics: [
            "Evaluări fitness",
            "Comunicare și motivare",
            "DezvoltareBusinessAfacere",
          ],
        },
      ],
      schedule:
        "Luni - Vineri: 18:00 - 21:00 | Sâmbătă: 10:00 - 14:00",
    },
    trainers: [
      {
        name: "Alexandru Popescu",
        role: "Coordonator Curs",
        bio: "Expert în antrenament de forță cu peste 10 ani experiență și certificări internaționale NASM, ACE.",
        image: "/images/trainers/alexandru.jpg",
      },
      {
        name: "Elena Vasilescu",
        role: "Instructor Nutriție",
        bio: "Nutriționist sportiv certificat cu experiență în lucrul cu sportivi de performanță.",
        image: "/images/trainers/elena.jpg",
      },
    ],
    exam: {
      format: "Examen teoretic (test grilă) + Examen practic (demonstrație antrenament)",
      duration: "3 ore total",
      passingGrade: "75%",
      certification: "Certificare EREPS Nivel 3 - Recunoaștere Internațională",
    },
  },
  {
    id: 2,
    title: "Instructor Aerobic & Group Fitness",
    description: "Specializare completă în clase de grup",
    duration: "12 săptămâni",
    image: "/images/courses/aerobic.jpg",
    price: "2.800 RON",
    trainer: "Maria Ionescu",
    minEducation: "Liceu",
    slug: "instructor-aerobic-group-fitness",
    level: "Începător",
    rating: 4.8,
    studentsCount: 289,
    nextStartDate: "22 Aprilie 2026",
    spotsLeft: 12,
    highlights: [
      "Certificare Group Fitness Instructor",
      "Practică cu clase reale",
      "Choreografii profesionale incluse",
      "Suport 3 luni post-curs",
    ],
    included: [
      "12 săptămâni de training intensiv",
      "Materiale de curs complete",
      "Certificare Level 2",
      "5 choreografii profesionale",
      "3 luni mentorat",
      "Muzică pentru clase",
    ],
    testimonials: [
      {
        name: "Andreea Stefan",
        role: "Absolventă 2025",
        text: "Am învățat să conduc clase captivante și am primit un job imediat!",
        image: "/images/testimonials/andreea.jpg",
      },
      {
        name: "Radu Pop",
        role: "Absolvent 2024",
        text: "Cel mai bun curs de group fitness din România. Trainerii sunt super!",
        image: "/images/testimonials/radu.jpg",
      },
    ],
    faq: [
      {
        question: "Trebuie să știu să dansez?",
        answer:
          "Nu este necesar. Te vom învăța toate mișcările și tehnicile de choreografie pas cu pas.",
      },
      {
        question: "Primesc muzică pentru clase?",
        answer:
          "Da, vei primi acces la biblioteca noastră cu muzică licențiată pentru clase de grup.",
      },
    ],
    fullDescription:
      "Învață să conduci clase de grup captivante și motivante. Programul acoperă toate stilurile populare de fitness de grup: aerobic, step, cycling indoor, și antrenamente funcționale de grup.",
    requirements: {
      documents: [
        "Copie diplomă de bacalaureat",
        "Copie carte de identitate",
        "Certificat medical",
        "2 fotografii tip buletin",
      ],
      fees: {
        inscription: "400 RON",
        monthly: "800 RON x 3 luni",
        total: "2.800 RON",
      },
    },
    curriculum: {
      modules: [
        {
          title: "Fundamente Group Fitness",
          topics: [
            "Structura unei clase de grup",
            "Muzică și choreografie",
            "Comunicare și comandă verbală",
          ],
        },
        {
          title: "Stiluri de Clase",
          topics: [
            "Aerobic clasic și modern",
            "Step aerobic",
            "Indoor cycling",
            "HIIT pentru grupuri",
          ],
        },
        {
          title: "Siguranță și Modificări",
          topics: [
            "Prevenirea accidentărilor",
            "Modificări pentru toate nivelurile",
            "Managementul sălii",
          ],
        },
      ],
      schedule: "Marți & Joi: 18:00 - 21:00 | Sâmbătă: 09:00 - 13:00",
    },
    trainers: [
      {
        name: "Maria Ionescu",
        role: "Coordonator Curs",
        bio: "Instructor certificat cu peste 8 ani experiență în predarea claselor de grup în sălile de top.",
        image: "/images/trainers/maria.jpg",
      },
    ],
    exam: {
      format: "Examen practic (predare clasă de grup) + Portofoliu choreografii",
      duration: "2 ore",
      passingGrade: "70%",
      certification: "Certificare Group Fitness Instructor - Nivel 2",
    },
  },
  {
    id: 3,
    title: "Nutriție Sportivă",
    description: "Fundamentele nutriției pentru performanță",
    duration: "8 săptămâni",
    image: "/images/courses/nutrition.jpg",
    price: "2.200 RON",
    trainer: "Elena Vasilescu",
    minEducation: "Liceu",
    slug: "nutritie-sportiva",
    level: "Începător - Intermediar",
    rating: 4.9,
    studentsCount: 412,
    nextStartDate: "29 Aprilie 2026",
    spotsLeft: 6,
    highlights: [
      "Certificare Sports Nutrition Specialist",
      "Planuri alimentare practice",
      "Suplimente și timing nutrițional",
      "Software de planificare inclus",
    ],
    included: [
      "8 săptămâni de curs",
      "Materiale digitale complete",
      "Certificare SN Specialist",
      "Software de planificare",
      "Templates planuri alimentare",
      "Acces la baza de date alimente",
    ],
    testimonials: [
      {
        name: "Carmen Dumitrescu",
        role: "Absolventă 2025",
        text: "Acum consult sportivi de performanță. Cursul m-a pregătit perfect!",
        image: "/images/testimonials/carmen.jpg",
      },
      {
        name: "Alex Marin",
        role: "Absolvent 2024",
        text: "Cea mai bună investiție în cariera mea. Sunt acum nutriționist certificat!",
        image: "/images/testimonials/alex.jpg",
      },
    ],
    faq: [
      {
        question: "Trebuie să am studii medicale?",
        answer:
          "Nu este necesar. Cursul acoperă toate fundamentele necesare pentru a deveni consultant în nutriție sportivă.",
      },
      {
        question: "Pot consulta clienți după curs?",
        answer:
          "Da, vei primi certificare care îți permite să oferi consultanță în nutriție sportivă în România și UE.",
      },
    ],
    fullDescription:
      "Descoperă secretele nutriției sportive și învață să creezi planuri alimentare personalizate pentru diferite obiective: pierdere în greutate, creștere musculară, sau performanță sportivă.",
    requirements: {
      documents: [
        "Copie diplomă de bacalaureat",
        "Copie carte de identitate",
        "2 fotografii tip buletin",
      ],
      fees: {
        inscription: "300 RON",
        monthly: "950 RON x 2 luni",
        total: "2.200 RON",
      },
    },
    curriculum: {
      modules: [
        {
          title: "Bazele Nutriției",
          topics: [
            "Macronutrienți: proteine, carbohidrați, grăsimi",
            "Micronutrienți și vitamine",
            "Hidratare și electroliți",
          ],
        },
        {
          title: "Nutriție pentru Performanță",
          topics: [
            "Timing nutrițional",
            "Strategii pre și post antrenament",
            "Suplimente sportive",
          ],
        },
        {
          title: "Planificare Alimentară",
          topics: [
            "Calcularea necesarului caloric",
            "Planuri pentru diferite obiective",
            "Consultanță nutrițională",
          ],
        },
      ],
      schedule: "Miercuri: 18:00 - 21:00 | Sâmbătă: 10:00 - 13:00",
    },
    trainers: [
      {
        name: "Elena Vasilescu",
        role: "Coordonator Curs",
        bio: "Nutriționist sportiv certificat internațional cu experiență în lucrul cu sportivi de performanță.",
        image: "/images/trainers/elena.jpg",
      },
    ],
    exam: {
      format: "Examen teoretic + Studiu de caz (creare plan alimentar)",
      duration: "2.5 ore",
      passingGrade: "75%",
      certification: "Certificare Sports Nutrition Specialist",
    },
  },
  {
    id: 4,
    title: "Antrenament Funcțional",
    description: "Tehnici avansate de antrenament funcțional",
    duration: "10 săptămâni",
    image: "/images/courses/functional.jpg",
    price: "2.600 RON",
    trainer: "Cristian Marinescu",
    minEducation: "Liceu",
    slug: "antrenament-functional",
    level: "Intermediar - Avansat",
    rating: 4.9,
    studentsCount: 267,
    nextStartDate: "6 Mai 2026",
    spotsLeft: 10,
    highlights: [
      "Certificare Functional Training Specialist",
      "Tehnici avansate cu echipament variat",
      "Evaluare FMS și SFMA",
      "Programare pentru sport performance",
    ],
    included: [
      "10 săptămâni training intensiv",
      "Materiale curs complete",
      "Certificare FT Specialist",
      "Acces la sală pentru practică",
      "Kit echipament mici",
      "Templates programe antrenament",
    ],
    testimonials: [
      {
        name: "Vlad Cristea",
        role: "Absolvent 2025",
        text: "Cel mai complet curs de functional training. Acum antrenez sportivi profesioniști!",
        image: "/images/testimonials/vlad.jpg",
      },
      {
        name: "Ioana Popa",
        role: "Absolventă 2024",
        text: "M-am specializat în functional training și am triplat numărul de clienți!",
        image: "/images/testimonials/ioana.jpg",
      },
    ],
    faq: [
      {
        question: "Este necesar să fiu antrenor certificat?",
        answer:
          "Nu este obligatoriu, dar este recomandat să ai cunoștințe de bază în fitness. Cursul este de nivel intermediar-avansat.",
      },
      {
        question: "Ce echipament voi învăța să folosesc?",
        answer:
          "Vei învăța tehnici cu kettlebells, TRX, clubbells, resistance bands, medicine balls, și multe altele.",
      },
    ],
    fullDescription:
      "Masterizează antrenamentul funcțional modern, de la mișcări fundamentale până la programe complexe. Ideal pentru antrenori care vor să își diversifice oferta sau pasionați de fitness care vor să înțeleagă profund mișcarea umană.",
    requirements: {
      documents: [
        "Copie diplomă de bacalaureat",
        "Copie carte de identitate",
        "Certificat medical",
        "2 fotografii tip buletin",
      ],
      fees: {
        inscription: "400 RON",
        monthly: "1.100 RON x 2 luni",
        total: "2.600 RON",
      },
    },
    curriculum: {
      modules: [
        {
          title: "Principii Antrenament Funcțional",
          topics: [
            "Pattern-uri fundamentale de mișcare",
            "Stabilitate și mobilitate",
            "Lanțuri cinetice",
          ],
        },
        {
          title: "Tehnici și Echipament",
          topics: [
            "Kettlebells și clubbells",
            "TRX și antrenament în suspensie",
            "Plyometrie și agilitate",
          ],
        },
        {
          title: "Programare Funcțională",
          topics: [
            "Evaluare funcțională",
            "Progresii și regresii",
            "Periodizare funcțională",
          ],
        },
      ],
      schedule: "Luni & Miercuri: 18:00 - 21:00 | Duminică: 10:00 - 13:00",
    },
    trainers: [
      {
        name: "Cristian Marinescu",
        role: "Coordonator Curs",
        bio: "Specialist în mișcare funcțională cu certificări FMS, SFMA și experiență ca strength coach.",
        image: "/images/trainers/cristian.jpg",
      },
    ],
    exam: {
      format: "Examen practic (demonstrație exerciții) + Proiect (program antrenament funcțional)",
      duration: "3 ore",
      passingGrade: "75%",
      certification: "Certificare Functional Training Specialist",
    },
  },
];
