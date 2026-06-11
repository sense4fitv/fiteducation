import type { Metadata } from "next";
import LegalShell, {
  Bullets,
  ContactBox,
  Section,
  SubHeading,
} from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Termeni și Condiții | Fiteducation School",
  description:
    "Termenii și condițiile de utilizare a serviciilor educaționale Fiteducation – Școală de Fitness.",
};

const CONTACT = {
  email: "office@fiteducationschool.com",
  phone: "+40 721 550 902",
  address: "Strada Tablei nr. 8, Brașov, România",
};

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Document legal"
      title="Termeni și Condiții"
      subtitle="Fiteducation – Școală de Fitness, operată de Asociația Club Sportiv Fit Education."
      updatedAt="01.05.2026"
    >
      <Section number={1} title="Informații generale">
        <p>
          Prezenta secțiune are rolul de a identifica în mod clar entitatea
          juridică responsabilă pentru organizarea și desfășurarea cursurilor și
          de a stabili cadrul legal general în care aceste servicii sunt
          oferite.
        </p>
        <p>
          Fiteducation este un brand educațional operat de{" "}
          <strong>Asociația Club Sportiv Fit Education</strong>, persoană
          juridică română fără scop patrimonial, cu sediul social în Strada
          Tablei nr. 8, Municipiul Brașov, Județul Brașov, România, înregistrată
          fiscal cu CUI 33415055, înființată la data de 24.07.2014, denumită în
          continuare „Organizator”.
        </p>
        <p>
          Organizatorul desfășoară activități în domeniul educației sportive și
          fitness, oferind cursuri de formare profesională și workshop-uri
          specializate.
        </p>
        <ContactBox {...CONTACT} />
        <p>
          Prin accesarea serviciilor și, în special, prin înscrierea la
          cursurile și/sau workshop-urile organizate de Fiteducation, orice
          persoană dobândește calitatea de cursant și confirmă în mod expres,
          liber și neechivoc faptul că a citit, înțeles și acceptat integral
          prevederile prezentului document.
        </p>
      </Section>

      <Section number={2} title="Definiții">
        <p>
          Prezenta secțiune are rolul de a elimina orice ambiguitate în
          interpretarea termenilor utilizați în document.
        </p>
        <Bullets
          items={[
            <><strong>Organizator</strong> – Asociația Club Sportiv Fit Education</>,
            <><strong>Fiteducation</strong> – brandul educațional sub care sunt organizate cursurile</>,
            <><strong>Cursant</strong> – orice persoană fizică înscrisă la un curs sau workshop</>,
            <><strong>Curs</strong> – program educațional structurat, cu componentă teoretică și/sau practică</>,
            <><strong>Workshop / Specializare</strong> – program educațional de scurtă durată, axat pe o tematică specifică</>,
            <><strong>Formator / Instructor</strong> – persoană calificată și autorizată să susțină activități educaționale</>,
            <><strong>Platformă online</strong> – sistem digital utilizat pentru desfășurarea cursurilor la distanță</>,
            <><strong>Materiale educaționale</strong> – conținutul furnizat cursanților în orice format (video, PDF, live etc.)</>,
          ]}
        />
      </Section>

      <Section number={3} title="Descrierea serviciilor">
        <p>
          Organizatorul oferă programe de formare profesională și workshop-uri,
          incluzând, dar fără a se limita la:
        </p>
        <Bullets
          items={[
            "cursuri acreditate de Personal Trainer",
            "cursuri acreditate de Instructor Aerobic",
            "workshop-uri și specializări (ex: hipertrofie, functional training, crab etc.)",
          ]}
        />
        <SubHeading>Cursurile pot fi desfășurate:</SubHeading>
        <Bullets
          items={[
            "în format fizic, în locații din București și Brașov",
            "în format online (ZOOM)",
            "în format online (24/7) pe platforma creată de Fiteducation",
            "în format hibrid",
          ]}
        />
        <p>
          Organizatorul își rezervă dreptul de a adapta structura, conținutul și
          metodologia cursurilor, în funcție de evoluția domeniului și de
          nevoile educaționale. În același timp, cursanții vor fi informați, în
          prealabil, înainte de înscriere și efectuarea plății, cu privire la
          modalitatea de desfășurare a fiecărui curs sau modul (format fizic,
          online și/sau hibrid), precum și locația sau platforma utilizată.
        </p>
      </Section>

      <Section number={4} title="Acreditare și certificare">
        <p>
          Cursurile de Personal Trainer și Instructor Aerobic sunt acreditate de
          autoritățile competente și oferă certificări recunoscute la nivel
          național și în Uniunea Europeană, conform cadrului legal aplicabil.
        </p>
        <SubHeading>Obținerea certificării este condiționată de:</SubHeading>
        <Bullets
          items={[
            "participarea la curs în proporție de minim 80%",
            "promovarea evaluărilor",
            "respectarea cerințelor Organizatorului",
          ]}
        />
        <p>
          Workshop-urile și programele de specializare pot avea certificări
          interne, care nu echivalează cu calificări profesionale acreditate.
        </p>
      </Section>

      <Section number={5} title="Condiții de înscriere">
        <p>
          Pentru înscriere, cursantul trebuie să îndeplinească următoarele
          condiții cumulative:
        </p>
        <Bullets
          items={[
            "să aibă vârsta minimă de 18 ani",
            "să dețină și să prezinte o diplomă de absolvire a studiilor liceale (12 clase), finalizate cu examen de bacalaureat",
            "după caz, copie a certificatului de căsătorie sau de divorț, în cazul în care numele actual diferă de cel înscris pe documentele de studii",
            "alte acte doveditoare de schimbare a numelui (dacă este cazul)",
            "să furnizeze documentele solicitate (CI, diplome, adeverință medicală etc.)",
            "adeverință medicală care să ateste că este apt pentru efort fizic",
            "să accepte prezentul document",
            "să achite costul cursului, în forma agreată cu Organizatorul (total/parțial)",
          ]}
        />
        <p>
          Organizatorul își rezervă dreptul de a refuza înscrierea în situații
          justificate.
        </p>
      </Section>

      <Section number={6} title="Taxe și modalități de plată">
        <p>Taxele sunt comunicate în prealabil și pot varia în funcție de program.</p>
        <SubHeading>Plata se poate face:</SubHeading>
        <Bullets
          items={[
            "integral",
            "în tranșe (formă de plată disponibilă în anumite condiții)",
            "prin Klarna direct din site-ul Fiteducation",
          ]}
        />
        <p className="text-sm text-[#555] italic">
          *Klarna – serviciu de plată furnizat de un terț, care permite
          achitarea taxei în rate, conform termenilor și condițiilor stabilite
          de acest furnizor, asupra cărora Organizatorul nu are control.
        </p>
        <p>
          Neachitarea la termen poate duce la suspendarea accesului sau
          excluderea din curs.
        </p>
        <p>
          Achitarea taxei de curs nu garantează accesul la examenul final,
          promovarea acestuia sau obținerea certificării, aceste aspecte fiind
          condiționate de îndeplinirea criteriilor de participare și evaluare
          stabilite de Organizator și, după caz, de autoritățile competente.
          Organizatorul nu își asumă responsabilitatea pentru rezultatele
          evaluărilor, acestea depinzând de nivelul de pregătire al fiecărui
          cursant și de deciziile evaluatorilor autorizați.
        </p>
      </Section>

      <Section number={7} title="Politica de anulare și rambursare">
        <p>
          În cazul retragerii înainte de începerea cursului, Organizatorul poate
          acorda rambursări parțiale.
        </p>
        <p>
          După începerea cursului, taxele nu sunt rambursabile, cu excepția unor
          situații excepționale (ex. medicale), evaluate de Organizator.
        </p>
      </Section>

      <Section number={8} title="Desfășurarea cursurilor">
        <p>
          Organizatorul își rezervă dreptul de a aduce modificări în ceea ce
          privește programul cursurilor, formatorii implicați, precum și
          locațiile sau platformele de desfășurare, atunci când aceste
          modificări sunt justificate de considerente organizatorice, logistice
          sau educaționale, având ca scop menținerea sau îmbunătățirea calității
          procesului de formare.
        </p>
        <p>
          Orice astfel de modificare va fi comunicată cursanților în timp util,
          anterior intrării în vigoare, însoțită de informații clare privind
          natura și motivul acesteia.
        </p>
        <p>
          Prin excepție, în situații neprevăzute și independente de voința
          Organizatorului — cum ar fi indisponibilitatea subită a unui formator
          din motive medicale — modificările pot interveni într-un termen mai
          scurt, urmând ca Organizatorul să informeze cursanții în cel mai scurt
          timp posibil și să depună toate eforturile rezonabile pentru a asigura
          continuitatea cursului în condiții optime.
        </p>
        <p>
          Cursantul are obligația de a respecta programul și regulile stabilite,
          în forma actualizată și comunicată de Organizator.
        </p>
      </Section>

      <Section number={9} title="Obligațiile cursantului">
        <p>
          Cursantul are responsabilitatea de a participa activ la procesul de
          formare, de a respecta programul stabilit și de a urma indicațiile
          formatorilor, în vederea desfășurării optime a activităților teoretice
          și practice. Totodată, cursantul se obligă să manifeste un
          comportament adecvat, bazat pe respect reciproc, profesionalism și
          responsabilitate, atât față de formatori, cât și față de ceilalți
          participanți.
        </p>
        <SubHeading>În mod expres, cursantului îi este interzis:</SubHeading>
        <Bullets
          items={[
            "să adopte un comportament agresiv, abuziv, discriminatoriu sau inadecvat, de natură să afecteze desfășurarea cursului sau siguranța celorlalți participanți;",
            "să participe la cursuri sub influența alcoolului sau a altor substanțe care pot afecta capacitatea de concentrare, coordonare sau siguranță în desfășurarea activităților fizice;",
            "să înregistreze, copieze, distribuie sau utilizeze în orice scop materialele educaționale, sesiunile de curs (inclusiv online) sau orice conținut aferent programului, fără acordul prealabil, expres și scris al Organizatorului.",
          ]}
        />
        <p>
          Nerespectarea obligațiilor prevăzute în prezenta secțiune poate
          conduce la măsuri din partea Organizatorului, inclusiv restricționarea
          accesului la cursuri sau excluderea din program, fără obligația de
          rambursare a taxelor achitate.
        </p>
      </Section>

      <Section number={10} title="Obligațiile organizatorului">
        <p>
          Organizatorul depune toate eforturile rezonabile pentru a furniza
          cursurile și workshop-urile într-un mod organizat, coerent și adaptat
          nivelului de pregătire al cursanților.
        </p>
        <SubHeading>În acest sens, Organizatorul:</SubHeading>
        <Bullets
          items={[
            "asigură desfășurarea cursurilor conform structurii și informațiilor comunicate în etapa de înscriere, cu respectarea eventualelor actualizări justificate și comunicate în timp util;",
            "colaborează cu formatori calificați și cu experiență relevantă în domeniu;",
            "pune la dispoziția cursanților materiale educaționale și resurse necesare desfășurării procesului de învățare;",
            "comunică în mod clar și în timp util informațiile relevante privind programul, locațiile, platformele utilizate sau eventualele modificări intervenite;",
            "depune diligențele necesare pentru a asigura un mediu de desfășurare sigur și adecvat activităților, în limitele rezonabile ale organizării și controlului său.",
          ]}
        />
        <p>
          Organizatorul nu garantează atingerea unor rezultate individuale
          specifice de către cursanți (inclusiv promovarea examenelor sau
          obținerea certificărilor), acestea depinzând de implicarea, nivelul de
          pregătire și performanța fiecărei persoane.
        </p>
      </Section>

      <Section number={11} title="Evaluare">
        <p>
          Evaluarea cunoștințelor și competențelor dobândite în cadrul
          cursurilor poate include, în funcție de specificul programului, probe
          teoretice și/sau practice, stabilite de Organizator sau, după caz, de
          autoritățile competente implicate în procesul de certificare.
        </p>
        <p>
          Participarea la procesul de evaluare este condiționată de îndeplinirea
          cerințelor minime de participare la curs, inclusiv prezența la
          activități și parcurgerea conținutului educațional.
        </p>
        <SubHeading>Obținerea certificării este condiționată de:</SubHeading>
        <Bullets
          items={[
            "promovarea evaluărilor stabilite;",
            "respectarea cerințelor de participare;",
            "îndeplinirea tuturor criteriilor aplicabile programului urmat.",
          ]}
        />
        <p>
          Subiectele și cerințele de evaluare sunt formulate pe baza
          conținutului predat în cadrul cursului, însă pot acoperi orice parte a
          materiei parcurse, fără a fi limitate la anumite capitole sau teme
          specifice comunicate în prealabil.
        </p>
        <p>
          Cursantul înțelege și acceptă că plata taxei de curs oferă acces la
          procesul educațional și la evaluare, dar nu garantează promovarea
          examenelor sau obținerea certificării.
        </p>
      </Section>

      <Section number={12} title="Sănătate și responsabilitate">
        <p>
          Prin participarea la cursuri, cursantul declară pe propria răspundere
          că este apt din punct de vedere medical pentru desfășurarea
          activităților fizice implicate. Cursantul are obligația de a prezenta,
          anterior participării la activități, o adeverință medicală valabilă
          care să ateste că este „apt pentru efort fizic” sau „apt pentru
          sport”. În lipsa prezentării acestui document, Organizatorul își
          rezervă dreptul de a restricționa accesul la cursuri, fără a afecta
          obligațiile financiare asumate.
        </p>
        <SubHeading>Este responsabilitatea exclusivă a cursantului:</SubHeading>
        <Bullets
          items={[
            "să își evalueze corect capacitatea fizică;",
            "să informeze Organizatorul sau formatorii cu privire la eventuale afecțiuni, limitări sau condiții medicale relevante;",
            "să respecte instrucțiunile primite în cadrul activităților.",
          ]}
        />
        <SubHeading>Organizatorul nu poate fi ținut responsabil pentru:</SubHeading>
        <Bullets
          items={[
            "accidentări survenite ca urmare a nerespectării indicațiilor formatorilor;",
            "utilizarea incorectă a echipamentelor;",
            "afecțiuni preexistente nedeclarate sau agravate în timpul activităților;",
            "orice situații generate de comportamentul necorespunzător al cursantului.",
          ]}
        />
      </Section>

      <Section number={13} title="Proprietate intelectuală">
        <p>
          Toate materialele educaționale puse la dispoziția cursanților în
          cadrul programelor organizate de Fiteducation, inclusiv, dar fără a se
          limita la: suporturi de curs, prezentări, documente, materiale video
          sau audio, înregistrări ale sesiunilor online, conținut digital sau
          fizic, reprezintă proprietatea Organizatorului și/sau a formatorilor,
          după caz, fiind protejate conform legislației aplicabile.
        </p>
        <SubHeading>Este interzisă, fără acordul prealabil, expres și scris al Organizatorului:</SubHeading>
        <Bullets
          items={[
            "reproducerea, copierea sau stocarea materialelor în scopuri externe cursului;",
            "distribuirea, transmiterea sau publicarea materialelor către terți, în orice formă;",
            "utilizarea materialelor în scop comercial sau profesional (inclusiv pentru susținerea altor cursuri sau programe);",
            "înregistrarea sesiunilor de curs (inclusiv online), integral sau parțial, fără acordul Organizatorului.",
          ]}
        />
      </Section>

      <Section number={14} title="Participarea minorilor">
        <p>
          Programele educaționale organizate de Fiteducation sunt destinate
          exclusiv persoanelor care au împlinit vârsta de 18 ani.
        </p>
        <p>
          Prin înscrierea la cursuri și furnizarea datelor necesare
          participării, cursantul declară pe propria răspundere că are
          capacitate legală deplină și că a împlinit vârsta minimă necesară
          pentru accesarea serviciilor oferite de Organizator.
        </p>
        <p>
          Organizatorul nu își asumă responsabilitatea pentru furnizarea de
          informații false, incomplete sau inexacte privind vârsta persoanei
          înscrise.
        </p>
      </Section>

      <Section number={15} title="Protecția datelor (GDPR)">
        <p>
          Organizatorul prelucrează datele personale furnizate de cursanți,
          precum: nume, prenume, număr de telefon, adresă de email și alte
          informații necesare înscrierii și desfășurării cursurilor, în scopuri
          legitime.
        </p>
        <SubHeading>Cursantul beneficiază de următoarele drepturi:</SubHeading>
        <Bullets
          items={[
            "dreptul de acces la datele personale;",
            "dreptul la rectificarea datelor inexacte;",
            "dreptul la ștergerea datelor („dreptul de a fi uitat”), în condițiile legii;",
            "dreptul la restricționarea prelucrării;",
            "dreptul la opoziție;",
            "dreptul la portabilitatea datelor, acolo unde este aplicabil.",
          ]}
        />
        <p>
          Pentru detalii complete, consultă{" "}
          <a
            href="/politica-de-confidentialitate"
            className="text-[#B8001F] hover:underline font-medium"
          >
            Politica de Confidențialitate
          </a>
          .
        </p>
      </Section>

      <Section number={16} title="Utilizarea imaginii și înregistrărilor">
        <p>
          În cadrul cursurilor și workshop-urilor, Organizatorul poate realiza
          fotografii, înregistrări video sau audio care surprind desfășurarea
          activităților, în scopuri educaționale, de documentare și promovare.
        </p>
        <SubHeading>Prin participarea la cursuri, cursantul își exprimă acordul pentru utilizarea acestor materiale în scopuri precum:</SubHeading>
        <Bullets
          items={[
            "promovarea programelor Fiteducation (rețele sociale, website sau alte materiale de marketing);",
            "prezentarea activităților desfășurate;",
            "utilizarea în materiale educaționale sau informative.",
          ]}
        />
        <p>
          Cursantul are dreptul de a-și retrage consimțământul privind
          utilizarea imaginii, printr-o solicitare scrisă transmisă la adresa de
          contact a Organizatorului. Retragerea consimțământului produce efecte
          pentru utilizările viitoare și nu afectează materialele deja realizate
          și utilizate anterior solicitării.
        </p>
      </Section>

      <Section number={17} title="Comunicare (email / WhatsApp / platforme digitale)">
        <p>
          Pentru buna organizare și desfășurare a activităților, cursantul
          acceptă să primească informații și notificări relevante prin
          intermediul canalelor de comunicare utilizate de Organizator,
          inclusiv:
        </p>
        <Bullets
          items={[
            "email;",
            "telefon;",
            "grupuri de comunicare (ex. WhatsApp sau alte aplicații similare);",
            "platforme online dedicate cursurilor.",
          ]}
        />
        <p>
          În cazul grupurilor de comunicare, cursantul înțelege și acceptă că
          poate avea vizibilitate asupra anumitor date ale celorlalți
          participanți (ex. nume, număr de telefon, fotografie de profil, în
          funcție de setările fiecăruia).
        </p>
      </Section>

      <Section number={18} title="Clauză privind formatorii / colaboratorii">
        <p>
          Formatorii și colaboratorii care susțin activitățile educaționale în
          cadrul programelor Fiteducation pot avea acces la anumite canale de
          comunicare utilizate pentru organizarea cursurilor (grupuri WhatsApp
          sau alte platforme similare), exclusiv în scopul coordonării
          activităților.
        </p>
        <p>
          Aceștia nu au acces la baze de date interne sau la alte informații
          personale ale cursanților, în afara celor care devin vizibile în mod
          implicit prin utilizarea platformelor de comunicare.
        </p>
      </Section>

      <Section number={19} title="Încetarea participării">
        <SubHeading>Participarea cursantului la cursuri poate înceta:</SubHeading>
        <Bullets
          items={[
            "la inițiativa cursantului, prin retragere voluntară (fără rambursare din partea Organizatorului);",
            "la inițiativa Organizatorului, în condițiile prevăzute în prezentul document;",
            "prin finalizarea programului educațional;",
            "în alte situații justificate, conform legislației aplicabile.",
          ]}
        />
        <SubHeading>Organizatorul își rezervă dreptul de a înceta participarea unui cursant, cu efect imediat, în cazul în care acesta:</SubHeading>
        <Bullets
          items={[
            "nu-și respectă obligațiile de plată;",
            "încalcă regulile de conduită sau prevederile prezentului document;",
            "adoptă un comportament care afectează desfășurarea cursurilor sau siguranța participanților;",
            "utilizează în mod necorespunzător materialele sau resursele puse la dispoziție.",
          ]}
        />
        <p>
          În cazul încetării participării din motive imputabile cursantului,
          sumele achitate nu sunt rambursabile.
        </p>
      </Section>

      <Section number={20} title="Limitarea răspunderii">
        <p>
          Organizatorul depune toate eforturile rezonabile pentru a asigura
          acuratețea și relevanța informațiilor prezentate în cadrul cursurilor
          și workshop-urilor, precum și pentru desfășurarea acestora în condiții
          adecvate. Cu toate acestea, Organizatorul nu poate garanta obținerea
          unor rezultate individuale specifice de către cursanți.
        </p>
        <SubHeading>Organizatorul nu poate fi ținut responsabil pentru:</SubHeading>
        <Bullets
          items={[
            "prejudicii indirecte, inclusiv, dar fără a se limita la pierderi de oportunități, beneficii sau câștiguri rezultate din participarea sau neparticiparea la cursuri;",
            "modul în care cursanții aleg să utilizeze informațiile dobândite, inclusiv aplicarea incorectă sau neadecvată a acestora în practică;",
            "deciziile profesionale sau personale luate de cursanți pe baza informațiilor furnizate în cadrul programelor;",
            "eventuale diferențe între așteptările individuale ale cursanților și rezultatele efective ale procesului educațional.",
          ]}
        />
        <p>
          În toate cazurile, răspunderea Organizatorului este limitată la
          limitele prevăzute de legislația aplicabilă.
        </p>
        <ContactBox {...CONTACT} />
      </Section>
    </LegalShell>
  );
}
