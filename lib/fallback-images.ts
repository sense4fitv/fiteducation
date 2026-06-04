// Local public assets used as fallbacks when a Supabase storage image is not
// yet uploaded. Once admin uploads a real photo / cover via the CMS, the
// DB value (cover_image_path / photo_path) overrides this — see
// pickCourseImage and pickTrainerImage in lib/supabase/queries/public.ts.

export const COURSE_FALLBACK: Record<string, string> = {
  "curs-personal-trainer": "/images/courses/personal-trainer.jpg",
  "curs-aerobic": "/images/courses/aerobic.jpg",
  "group-fitness-introduction": "/images/courses/aerobic.jpg",
  "professional-development": "/images/courses/aerobic.jpg",
  "functional-step-body-in-action": "/images/courses/functional.jpg",
  "step-moves": "/images/courses/aerobic.jpg",
  "cardio-moves": "/images/courses/aerobic.jpg",
  hipertrofie: "/images/courses/personal-trainer.jpg",
};

export const COURSE_FALLBACK_DEFAULT = "/images/courses/personal-trainer.jpg";

export const TRAINER_FALLBACK: Record<string, string> = {
  "flavius-turcanu": "/trainers/flavius.png",
  "bianca-margarit": "/trainers/bianca.png",
  "attila-kovacs": "/trainers/attila.png",
  "robert-florea": "/trainers/robert.png",
  "ana-georgescu": "/trainers/ana.png",
  "antonio-enache": "/trainers/antonio.png",
};

export const TRAINER_FALLBACK_DEFAULT = "/trainers/flavius.png";
