import type { Metadata } from "next";
import LegalShell, {
  Bullets,
  ContactBox,
  Section,
  SubHeading,
} from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Politica de Cookies | Fiteducation School",
  description:
    "Informații despre tipurile de cookie-uri utilizate pe site-ul Fiteducation, scopurile prelucrării și gestionarea preferințelor.",
};

const CONTACT = {
  email: "office@fiteducationschool.com",
  phone: "+40 721 550 902",
  address: "Strada Tablei nr. 8, Brașov, România",
};

export default function CookiesPage() {
  return (
    <LegalShell
      eyebrow="Document legal"
      title="Politica de Cookies"
      subtitle="Fiteducation – Școală de Fitness, operată de Asociația Club Sportiv Fit Education."
      updatedAt="01.05.2026"
    >
      <Section number={1} title="Introducere">
        <p>
          Prezenta Politică de Cookies are rolul de a informa utilizatorii
          website-ului Fiteducation cu privire la utilizarea cookie-urilor și a
          tehnologiilor similare în cadrul platformelor și serviciilor operate
          de Asociația Club Sportiv Fit Education.
        </p>
        <p>
          Website-ul utilizează cookie-uri și tehnologii similare pentru a
          asigura funcționarea corectă a platformei, pentru îmbunătățirea
          experienței utilizatorilor, pentru analiză și statistică, precum și,
          în anumite situații, pentru personalizarea conținutului și
          activităților de promovare.
        </p>
        <p>
          Prezenta politică completează{" "}
          <a
            href="/termeni-si-conditii"
            className="text-[#B8001F] hover:underline font-medium"
          >
            Termenii și Condițiile
          </a>{" "}
          și{" "}
          <a
            href="/politica-de-confidentialitate"
            className="text-[#B8001F] hover:underline font-medium"
          >
            Politica de Confidențialitate
          </a>{" "}
          disponibile pe website-ul Fiteducation.
        </p>
      </Section>

      <Section number={2} title="Identitatea operatorului">
        <p>
          Operatorul website-ului și al datelor colectate prin intermediul
          cookie-urilor este:
        </p>
        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <p className="font-semibold text-[#0A0A0A] mb-2">
            Asociația Club Sportiv Fit Education
          </p>
          <p className="text-sm text-[#555]">
            Sediu: Strada Tablei nr. 8, Municipiul Brașov, Județul Brașov,
            România
            <br />
            CUI: 33415055
          </p>
        </div>
        <ContactBox {...CONTACT} />
      </Section>

      <Section number={3} title="Ce sunt cookie-urile">
        <p>
          Cookie-urile sunt fișiere de mici dimensiuni stocate pe dispozitivul
          utilizatorului (computer, telefon mobil, tabletă sau alte echipamente)
          atunci când acesta accesează un website.
        </p>
        <p>
          Aceste fișiere permit website-ului să recunoască dispozitivul
          utilizatorului și să rețină anumite informații privind preferințele
          sau activitatea acestuia, contribuind la funcționarea eficientă a
          platformei și la îmbunătățirea experienței de navigare.
        </p>
        <p>
          Cookie-urile nu conțin, în mod obișnuit, programe software și nu pot
          accesa informații stocate pe dispozitivul utilizatorului.
        </p>
      </Section>

      <Section number={4} title="Tipuri de cookie-uri utilizate">
        <p>
          Website-ul Fiteducation poate utiliza următoarele categorii de
          cookie-uri:
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-[#B8001F] font-bold mb-2">
              4.1 · Strict necesare
            </p>
            <p className="text-sm text-[#2A2A2A] leading-relaxed">
              Esențiale pentru funcționarea corectă a website-ului. Permit
              utilizarea funcțiilor de bază ale platformei. Nu necesită
              consimțământ prealabil.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-[#B8001F] font-bold mb-2">
              4.2 · Analiză și performanță
            </p>
            <p className="text-sm text-[#2A2A2A] leading-relaxed">
              Colectează informații privind paginile accesate, durata vizitei și
              eventualele erori. Datele sunt utilizate, de regulă, în formă
              agregată și anonimă.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-[#B8001F] font-bold mb-2">
              4.3 · Funcționalitate
            </p>
            <p className="text-sm text-[#2A2A2A] leading-relaxed">
              Permit website-ului să rețină preferințe precum limba selectată,
              preferințele de afișare și alte setări personalizate.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-[#B8001F] font-bold mb-2">
              4.4 · Marketing și publicitate
            </p>
            <p className="text-sm text-[#2A2A2A] leading-relaxed">
              Pot fi plasate de Organizator sau de terți (social media, analiză,
              publicitate online). Sunt utilizate exclusiv pe baza
              consimțământului utilizatorului.
            </p>
          </div>
        </div>
      </Section>

      <Section number={5} title="Cookie-uri plasate de terți">
        <p>
          Anumite secțiuni ale website-ului pot integra servicii furnizate de
          terți, precum:
        </p>
        <Bullets
          items={[
            "platforme social media;",
            "servicii de analiză trafic;",
            "servicii de plată;",
            "conținut video integrat;",
            "platforme educaționale.",
          ]}
        />
        <p>
          Aceste servicii pot utiliza propriile cookie-uri, asupra cărora
          Organizatorul nu are control direct. Utilizatorii sunt încurajați să
          consulte politicile de confidențialitate și cookie-uri ale acestor
          furnizori terți.
        </p>
      </Section>

      <Section number={6} title="Durata de stocare a cookie-urilor">
        <SubHeading>Cookie-urile pot fi:</SubHeading>
        <Bullets
          items={[
            <>
              <strong>cookie-uri de sesiune</strong> – stocate temporar și
              șterse automat la închiderea browserului;
            </>,
            <>
              <strong>cookie-uri persistente</strong> – păstrate pentru o
              perioadă determinată sau până la ștergerea manuală de către
              utilizator.
            </>,
          ]}
        />
        <p>
          Durata de stocare poate varia în funcție de tipul și scopul
          cookie-ului utilizat.
        </p>
      </Section>

      <Section number={7} title="Gestionarea cookie-urilor">
        <p>
          Utilizatorii pot controla și gestiona utilizarea cookie-urilor prin
          intermediul setărilor browserului utilizat. În funcție de preferințe,
          utilizatorii pot:
        </p>
        <Bullets
          items={[
            "bloca anumite cookie-uri;",
            "șterge cookie-urile existente;",
            "configura notificări privind utilizarea acestora.",
          ]}
        />
        <p>
          Dezactivarea anumitor cookie-uri poate afecta funcționarea
          corespunzătoare a website-ului sau experiența de utilizare.
        </p>
      </Section>

      <Section number={8} title="Consimțământul utilizatorului">
        <p>
          La prima accesare a website-ului, utilizatorilor le poate fi afișat un
          mecanism de informare și gestionare a preferințelor privind
          cookie-urile.
        </p>
        <p>
          Prin continuarea utilizării website-ului și/sau selectarea opțiunilor
          disponibile în bannerul de cookies, utilizatorul își poate exprima
          acordul privind utilizarea anumitor categorii de cookie-uri.
        </p>
        <p>
          Utilizatorul își poate modifica sau retrage consimțământul în orice
          moment, prin actualizarea preferințelor browserului sau a setărilor
          disponibile pe website.
        </p>
      </Section>

      <Section number={9} title="Securitate și confidențialitate">
        <p>
          Cookie-urile sunt utilizate într-un mod care urmărește protejarea
          securității și confidențialității utilizatorilor. Organizatorul depune
          eforturi rezonabile pentru a colabora cu furnizori și servicii care
          respectă standardele aplicabile privind protecția datelor și
          securitatea informațiilor.
        </p>
      </Section>

      <Section number={10} title="Date privind minorii">
        <p>
          Website-ul Fiteducation nu este destinat persoanelor cu vârsta sub 18
          ani, iar Organizatorul nu urmărește colectarea intenționată de date
          prin intermediul cookie-urilor de la minori.
        </p>
      </Section>

      <Section number={11} title="Modificarea politicii de cookies">
        <p>
          Organizatorul își rezervă dreptul de a actualiza prezenta Politică de
          Cookies pentru a reflecta modificări legislative, tehnice sau
          operaționale. Orice actualizare va fi publicată pe website-ul
          Fiteducation, iar continuarea utilizării platformei după publicarea
          modificărilor reprezintă acceptarea versiunii actualizate.
        </p>
      </Section>

      <Section number={12} title="Contact">
        <p>
          Pentru întrebări, solicitări sau informații suplimentare privind
          utilizarea cookie-urilor, utilizatorii pot contacta Organizatorul la:
        </p>
        <ContactBox {...CONTACT} />
      </Section>
    </LegalShell>
  );
}
