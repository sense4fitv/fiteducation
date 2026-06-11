import type { Metadata } from "next";
import LegalShell, {
  Bullets,
  ContactBox,
  Section,
  SubHeading,
} from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate | Fiteducation School",
  description:
    "Modul în care Fiteducation colectează, utilizează și protejează datele cu caracter personal, conform GDPR.",
};

const CONTACT = {
  email: "office@fiteducationschool.com",
  phone: "+40 721 550 902",
  address: "Strada Tablei nr. 8, Brașov, România",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Document legal"
      title="Politica de Confidențialitate"
      subtitle="Fiteducation – Școală de Fitness, operată de Asociația Club Sportiv Fit Education."
      updatedAt="01.05.2026"
    >
      <Section number={1} title="Introducere">
        <p>
          Prezenta Politică de Confidențialitate are rolul de a explica modul în
          care Asociația Club Sportiv Fit Education, operatorul brandului
          Fiteducation, colectează, utilizează, stochează și protejează datele
          cu caracter personal ale persoanelor care interacționează cu
          serviciile și activitățile sale.
        </p>
        <p>
          Respectarea confidențialității și protecția datelor personale
          reprezintă un aspect important al activității Organizatorului, motiv
          pentru care prelucrarea datelor se realizează în conformitate cu
          legislația aplicabilă, inclusiv Regulamentul (UE) 2016/679 privind
          protecția persoanelor fizice în ceea ce privește prelucrarea datelor
          cu caracter personal („GDPR”).
        </p>
        <p>
          Prin accesarea serviciilor, înscrierea la cursuri sau interacțiunea cu
          platformele și canalele de comunicare utilizate de Fiteducation,
          persoana vizată confirmă că a luat la cunoștință{" "}
          <a
            href="/termeni-si-conditii"
            className="text-[#B8001F] hover:underline font-medium"
          >
            Termenii &amp; Condițiile
          </a>
          , cât și prevederile prezentei Politici de Confidențialitate.
        </p>
      </Section>

      <Section number={2} title="Identitatea operatorului de date">
        <p>Operatorul de date cu caracter personal este:</p>
        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <p className="font-semibold text-[#0A0A0A] mb-2">
            Asociația Club Sportiv Fit Education
          </p>
          <p className="text-sm text-[#555]">
            Sediu: Strada Tablei nr. 8, Municipiul Brașov, Județul Brașov,
            România
            <br />
            CUI: 33415055 · Data înființării: 24.07.2014
          </p>
        </div>
        <ContactBox {...CONTACT} />
        <p>
          În sensul prezentei politici, termenii „Organizator”, „Fiteducation”
          și „Operator” se referă la Asociația Club Sportiv Fit Education.
        </p>
      </Section>

      <Section number={3} title="Categoriile de date prelucrate">
        <p>
          În funcție de tipul interacțiunii cu Organizatorul, pot fi colectate
          și prelucrate următoarele categorii de date cu caracter personal:
        </p>
        <SubHeading>Date de identificare</SubHeading>
        <Bullets
          items={[
            "nume și prenume",
            "data nașterii",
            "seria și numărul actului de identitate",
            "CNP (acolo unde este necesar pentru certificări/acreditări)",
            "semnătura",
          ]}
        />
        <SubHeading>Date de contact</SubHeading>
        <Bullets
          items={[
            "adresă de email",
            "număr de telefon",
            "adresă de domiciliu/reședință",
          ]}
        />
        <SubHeading>Date necesare înscrierii</SubHeading>
        <Bullets
          items={[
            "diplome și documente de studii",
            "certificat de căsătorie/divorț (dacă există neconcordanțe între numele actual și cel înscris pe documentele de studii)",
            "alte acte doveditoare de schimbare a numelui (dacă este cazul)",
            "adeverință medicală „apt pentru sport” / „apt pentru efort fizic”",
          ]}
        />
        <SubHeading>Date privind participarea la cursuri</SubHeading>
        <Bullets
          items={[
            "prezență",
            "rezultate evaluări",
            "participare în platforme online",
            "activitate educațională",
          ]}
        />
        <SubHeading>Date media</SubHeading>
        <Bullets
          items={["fotografii", "înregistrări video/audio", "imagine și voce"]}
        />
        <SubHeading>Date tehnice</SubHeading>
        <Bullets
          items={[
            "adresa IP",
            "informații privind dispozitivul utilizat",
            "date colectate prin website sau platforme digitale",
          ]}
        />
      </Section>

      <Section number={4} title="Scopurile prelucrării datelor">
        <p>
          Datele personale sunt prelucrate exclusiv în scopuri legitime și
          determinate, precum:
        </p>
        <Bullets
          items={[
            "gestionarea înscrierii la cursuri și workshop-uri;",
            "verificarea eligibilității pentru programele acreditate;",
            "organizarea activităților educaționale;",
            "comunicarea informațiilor administrative și educaționale;",
            "organizarea evaluărilor și certificărilor;",
            "emiterea documentelor aferente cursurilor;",
            "desfășurarea activităților online și accesul la platformele utilizate;",
            "realizarea și utilizarea materialelor foto/video;",
            "îndeplinirea obligațiilor legale și fiscale;",
            "protejarea intereselor legitime ale Organizatorului;",
            "promovarea activităților Fiteducation, în condițiile legii.",
          ]}
        />
      </Section>

      <Section number={5} title="Temeiul legal al prelucrării">
        <p>
          Prelucrarea datelor se realizează în baza unuia sau mai multora dintre
          următoarele temeiuri legale:
        </p>
        <Bullets
          items={[
            "executarea relației dintre cursant și Organizator;",
            "obligații legale aplicabile Organizatorului;",
            "consimțământul persoanei vizate;",
            "interesul legitim al Organizatorului privind desfășurarea activităților educaționale;",
            "protejarea intereselor vitale ale persoanei vizate, atunci când este cazul.",
          ]}
        />
      </Section>

      <Section number={6} title="Durata stocării datelor">
        <p>
          Datele personale sunt păstrate doar pentru perioada necesară
          îndeplinirii scopurilor pentru care au fost colectate sau pentru
          perioada impusă de legislația aplicabilă.
        </p>
        <p>
          Documentele aferente programelor acreditate pot fi păstrate pentru
          perioade mai lungi, conform obligațiilor legale privind arhivarea și
          evidența formării profesionale.
        </p>
        <p>
          La expirarea perioadelor aplicabile, datele vor fi șterse sau
          anonimizate, în măsura permisă de lege.
        </p>
      </Section>

      <Section number={7} title="Transmiterea datelor către terți">
        <p>
          Organizatorul poate transmite date personale către terți exclusiv în
          măsura necesară desfășurării activităților și respectării obligațiilor
          legale. Aceste categorii pot include:
        </p>
        <Bullets
          items={[
            "formatori și colaboratori implicați în procesul educațional;",
            "autorități și instituții competente;",
            "furnizori de servicii IT, platforme online și servicii de comunicare;",
            "procesatori de plăți;",
            "parteneri implicați în certificare sau organizarea cursurilor.",
          ]}
        />
        <p>
          Datele nu vor fi vândute sau utilizate în alte scopuri decât cele
          prevăzute în prezenta politică.
        </p>
      </Section>

      <Section number={8} title="Comunicarea prin email, WhatsApp și platforme digitale">
        <p>
          Pentru desfășurarea activităților educaționale, Organizatorul poate
          utiliza:
        </p>
        <Bullets
          items={[
            "email",
            "telefon",
            "grupuri WhatsApp",
            "platforme online",
            "sisteme de videoconferință",
          ]}
        />
        <p>
          Prin participarea la cursuri, cursanții înțeleg și acceptă că anumite
          informații vizibile în cadrul acestor platforme (ex. nume, număr de
          telefon, fotografie de profil) pot fi accesibile celorlalți
          participanți sau formatorilor implicați în program.
        </p>
      </Section>

      <Section number={9} title="Utilizarea imaginii și a înregistrărilor">
        <p>
          În cadrul activităților desfășurate, Organizatorul poate realiza
          materiale foto, video sau audio în scopuri:
        </p>
        <Bullets items={["educaționale", "de documentare", "de promovare"]} />
        <SubHeading>Aceste materiale pot fi utilizate pe:</SubHeading>
        <Bullets
          items={[
            "website",
            "rețele sociale",
            "materiale promoționale",
            "platforme educaționale",
          ]}
        />
        <p>
          Persoana vizată își poate retrage consimțământul prin solicitare
          scrisă transmisă Organizatorului. Retragerea produce efecte pentru
          utilizările viitoare și nu afectează materialele deja utilizate legal
          anterior solicitării.
        </p>
      </Section>

      <Section number={10} title="Drepturile persoanelor vizate">
        <p>Persoanele vizate beneficiază de următoarele drepturi:</p>
        <Bullets
          items={[
            "dreptul de acces;",
            "dreptul la rectificare;",
            "dreptul la ștergerea datelor;",
            "dreptul la restricționarea prelucrării;",
            "dreptul la opoziție;",
            "dreptul la portabilitatea datelor;",
            "dreptul de a retrage consimțământul;",
            "dreptul de a depune plângere la autoritatea competentă.",
          ]}
        />
        <p>
          Solicitările privind exercitarea drepturilor pot fi transmise la:{" "}
          <a
            href="mailto:office@fiteducationschool.com"
            className="text-[#B8001F] hover:underline font-medium"
          >
            office@fiteducationschool.com
          </a>
          .
        </p>
      </Section>

      <Section number={11} title="Securitatea datelor">
        <p>
          Organizatorul adoptă măsuri tehnice și organizatorice rezonabile
          pentru protejarea datelor împotriva:
        </p>
        <Bullets
          items={[
            "accesului neautorizat;",
            "pierderii;",
            "distrugerii;",
            "divulgării neautorizate.",
          ]}
        />
        <p>
          Cu toate acestea, niciun sistem electronic sau metodă de transmitere a
          datelor nu poate garanta securitate absolută.
        </p>
      </Section>

      <Section number={12} title="Datele minorilor">
        <p>
          Serviciile și programele organizate de Fiteducation sunt destinate
          exclusiv persoanelor care au împlinit vârsta de 18 ani. Organizatorul
          nu urmărește și nu colectează în mod intenționat date personale
          aparținând minorilor.
        </p>
        <p>
          În cazul în care Organizatorul constată că au fost transmise date
          aparținând unei persoane care nu îndeplinește condiția minimă de
          vârstă, acestea pot fi șterse sau eliminate, în măsura permisă de
          lege.
        </p>
      </Section>

      <Section number={13} title="Cookie-uri și date tehnice">
        <p>
          Website-ul și platformele utilizate de Organizator pot colecta
          informații tehnice prin intermediul cookie-urilor sau tehnologiilor
          similare, în scopuri precum:
        </p>
        <Bullets
          items={[
            "funcționarea corectă a platformei;",
            "analiză și statistică;",
            "îmbunătățirea experienței utilizatorului.",
          ]}
        />
        <p>
          Detalii complete privind tipurile de cookie-uri utilizate, scopurile
          prelucrării și opțiunile de gestionare a acestora sunt disponibile în{" "}
          <a
            href="/politica-de-cookies"
            className="text-[#B8001F] hover:underline font-medium"
          >
            Politica de Cookies
          </a>{" "}
          disponibilă pe website-ul Fiteducation.
        </p>
      </Section>

      <Section number={14} title="Modificarea politicii de confidențialitate">
        <p>
          Organizatorul își rezervă dreptul de a actualiza prezenta Politică de
          Confidențialitate pentru a reflecta modificări legislative,
          operaționale sau organizaționale. Orice actualizare va fi comunicată
          prin canalele utilizate în mod obișnuit de Organizator.
        </p>
        <p>
          Continuarea utilizării serviciilor după publicarea modificărilor
          reprezintă acceptarea versiunii actualizate.
        </p>
      </Section>

      <Section number={15} title="Contact">
        <p>
          Pentru întrebări, solicitări sau sesizări privind protecția datelor și
          confidențialitatea, persoanele interesate pot contacta Organizatorul
          la:
        </p>
        <ContactBox {...CONTACT} />
      </Section>
    </LegalShell>
  );
}
