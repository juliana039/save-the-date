"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-09-05T19:30:00-04:00");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgqaybl";

const PERUCA_IMAGES = [
  `${BASE_PATH}/peruca/1.png`,
  `${BASE_PATH}/peruca/2.png`,
  `${BASE_PATH}/peruca/3.png`,
  `${BASE_PATH}/peruca/4.png`,
];

const MOOD_IMAGES = [
  `${BASE_PATH}/moods/imagem1.jpg`,
  `${BASE_PATH}/moods/imagem2.jpg`,
  `${BASE_PATH}/moods/imagem3.jpg`,
  `${BASE_PATH}/moods/imagem4.jpg`,
  `${BASE_PATH}/moods/imagem5.jpg`,
  `${BASE_PATH}/moods/imagem6.jpg`,
  `${BASE_PATH}/moods/imagem7.jpg`,
  `${BASE_PATH}/moods/imagem8.jpg`,
  `${BASE_PATH}/moods/imagem9.jpg`,
  `${BASE_PATH}/moods/imagem10.jpg`,
  `${BASE_PATH}/moods/imagem11.jpg`,
];

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function Countdown() {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const difference = Math.max(0, EVENT_DATE.getTime() - Date.now());
      setRemaining({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="countdown" aria-label="Contagem regressiva para a festa">
      {Object.entries(remaining).map(([key, value]) => (
        <div className="countdown-item" key={key}>
          <strong>{key === "days" ? value : pad(value)}</strong>
          <span>{({ days: "dias", hours: "horas", minutes: "min", seconds: "seg" } as Record<string, string>)[key]}</span>
        </div>
      ))}
    </div>
  );
}

function saveCalendar() {
  const calendar = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wig Party da Ju//Save the Date//PT-BR",
    "BEGIN:VEVENT", "UID:wig-party-ju-2026@save-the-date", "DTSTAMP:20260716T120000Z",
    "DTSTART:20260905T193000", "DTEND:20260905T233000", "SUMMARY:Wig Party da Ju",
    "LOCATION:A confirmar (ideia: karaokê + pizza)", "DESCRIPTION:Comemore os 25 da Ju! Horário: 19h30. A ideia é rolar num karaokê com pizza\\, mas depende de quantos confirmarem. Já pode procurar sua peruca!",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "wig-party-da-ju.ics";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function PerucaFlashBox({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFlash(true);
      window.setTimeout(() => setFlash(false), 120);
      setIndex((current) => (current + 1) % images.length);
    }, 500);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className="peruca-flashbox" aria-hidden="true">
      {images.map((src, i) => (
        <img key={i} src={src} alt="" className={i === index ? "is-active" : ""} />
      ))}
      <div className={`peruca-flash${flash ? " is-flashing" : ""}`} />
    </div>
  );
}

type Guest = { name: string };
type RsvpStatus = "idle" | "sending" | "sent" | "error";

function RsvpForm() {
  const [attending, setAttending] = useState<"yes" | "maybe" | "no" | null>(null);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [status, setStatus] = useState<RsvpStatus>("idle");

  function addGuest() {
    setGuests((current) => [...current, { name: "" }]);
  }

  function updateGuest(index: number, value: string) {
    setGuests((current) => current.map((guest, i) => (i === index ? { name: value } : guest)));
  }

  function removeGuest(index: number) {
    setGuests((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!attending || !name.trim()) return;

    setStatus("sending");
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name.trim(),
          vai: attending === "yes" ? "Sim" : attending === "maybe" ? "Talvez" : "Não",
          acompanhantes: guests.map((g) => g.name.trim()).filter(Boolean).join(", ") || "Nenhum",
        }),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rsvp-card rsvp-sent">
        <p>✦ Resposta enviada!</p>
        <h3>{attending === "yes" ? "Bora comemorar os 25 da Ju!" : attending === "maybe" ? "Bora ver se dá certo!" : "Que pena, você vai fazer falta!"}</h3>
      </div>
    );
  }

  return (
    <form className="rsvp-card" onSubmit={handleSubmit}>
      <div className="rsvp-toggle">
        <button type="button" className={attending === "yes" ? "is-active" : ""} onClick={() => setAttending("yes")}>Eu vou ✦</button>
        <button type="button" className={attending === "maybe" ? "is-active" : ""} onClick={() => setAttending("maybe")}>Talvez</button>
        <button type="button" className={attending === "no" ? "is-active" : ""} onClick={() => setAttending("no")}>Não vou poder</button>
      </div>

      {attending && (
        <div className="rsvp-fields">
          <label>
            Seu nome
            <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Como você se chama?" />
          </label>

          {(attending === "yes" || attending === "maybe") && (
            <div className="rsvp-guests">
              <span>Vai levar acompanhante?</span>
              {guests.map((guest, index) => (
                <div className="rsvp-guest-row" key={index}>
                  <input
                    value={guest.name}
                    onChange={(event) => updateGuest(index, event.target.value)}
                    placeholder={`Nome do acompanhante ${index + 1}`}
                  />
                  <button type="button" onClick={() => removeGuest(index)} aria-label="Remover acompanhante">✕</button>
                </div>
              ))}
              <button type="button" className="rsvp-add" onClick={addGuest}>＋ Adicionar acompanhante</button>
            </div>
          )}

          <button type="submit" className="button primary" disabled={status === "sending"}>
            {status === "sending" ? "Enviando..." : "Confirmar resposta"}
          </button>
          {status === "error" && <p className="rsvp-error">Não consegui enviar. Tenta de novo em instantes.</p>}
        </div>
      )}
    </form>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="inicio">
        <div className="hero-starburst" aria-hidden="true" />
        <div className="hero-star-sparks" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div>
        <div className="flash" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <nav aria-label="Navegação principal">
          <a className="wordmark" href="#inicio">JULIANA CONVIDA <i>✦</i></a>
          <div className="nav-links"><a className="nav-date" href="#detalhes">05.09.26</a></div>
        </nav>
        <div className="hero-copy reveal">
          <p className="eyebrow">Comemore os 25 da Ju</p>
          <h1 className="h1-small"><span>Wig</span><em>Party</em></h1>
          <p className="party-name">Save the date</p>
          <div className="date-lockup"><span>SÁB</span><strong>05 · 09 · 2026</strong></div>
          <div className="date-glitter-beam" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <p className="hero-note">Separe a data e comece a procurar sua peruca.</p>
          <div className="actions">
            <button className="button primary" onClick={saveCalendar}>＋ Salvar na agenda</button>
          </div>
        </div>
        <a className="scroll" href="#tema">deslize para descobrir ↓</a>
      </section>

      <section className="ticker" aria-hidden="true"><div>COLOQUE A PERUCA ✦ ESCOLHA SUA PERSONALIDADE ✦ 05.09.2026 ✦ COLOQUE A PERUCA ✦ ESCOLHA SUA PERSONALIDADE ✦</div></section>

      <section className="intro section" id="tema">
        <div className="intro-sparkles" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div>
        <div className="section-number">01 / O TEMA</div>
        <div className="intro-grid">
          <div className="intro-copy">
            <h2>Venha <em>comemorar</em> comigo!</h2>
            <div className="body-copy">
              <p>Esse ano, eu vou fazer 25 anos, o que já é metade da metade de uma vida — ou menos, rs.</p>
              <p>E você fez parte dessa história até aqui. Então, é claro que não podia ficar de fora dessa comemoração.</p>
              <p>E veio com uma condição: apareça de peruca. Colorida, curta, longa, natural ou completamente diferente do seu cabelo. Escolha a que mais combinar com a sua personalidade da noite. Agora é só vir e se divertir!</p>
            </div>
          </div>
          <img className="intro-photo" src={`${BASE_PATH}/25ANOS.png`} alt="Colagem dos 25 anos da Ju" />
        </div>
      </section>

      <section className="dress section">
        <div className="section-number light">02 / DICAS</div>
        <div className="dress-heading">
          <h2>Anota essas <span>dicas</span></h2>
          <p>Vista algo casual pra sair à noite</p>
        </div>

        <div className="tips-grid">
          <article className="tip-card">
            <span>Onde achar peruca</span>
            <p>Tem uma rua cheia de lojas de festa no centro, boa pedida pra comprar.</p>
            <a href="https://maps.app.goo.gl/XVS6Dhq5tcLKct2o9" target="_blank" rel="noopener noreferrer">Ver no mapa ↗</a>
          </article>
          <article className="tip-card">
            <span>Ou compre online</span>
            <p>Também tem como achar em lojas online - Shopee, AliExpress, etc.</p>
          </article>
          <article className="tip-card">
            <span>Reaproveite uma peruca</span>
            <p>Aquela peruca parada aí conta! Até a peruca da Copa ou de brilho serve pra fazer graça.</p>
          </article>
          <article className="tip-card tip-card-note">
            <span>Sobre o restaurante</span>
            <p>Ainda não definido — ou definido em breve. Aviso assim que fechar! </p>
          </article>
        </div>

        <div className="tips-monkeys" aria-hidden="true">
          <img className="monkey monkey-1" src={`${BASE_PATH}/macaconovo1.png`} alt="" />
          <img className="monkey monkey-2" src={`${BASE_PATH}/macaconovo2.png`} alt="" />
          <img className="monkey monkey-3" src={`${BASE_PATH}/macaconovo3.png`} alt="" />
        </div>

        <p className="only-rule">A única regra é <em>aparecer de peruca!</em></p>
      </section>

      <section className="details section" id="detalhes">
        <img className="details-disco-gold" src={`${BASE_PATH}/globo-dourado.png`} alt="" aria-hidden="true" />
        <div className="section-number">03 / ANOTE AÍ</div>
        <div className="details-title"><p>uma noite para celebrar</p><h2>05<br /><em>setembro</em><br />2026</h2></div>
        <div className="detail-cards">
          <article><span>Data</span><strong>Sábado, 5 de setembro<br />de 2026</strong></article>
          <article><span>Horário</span><strong>19h30</strong><small>Provável — pode ajustar</small></article>
          <article><span>Local</span><strong>Ideia: karaokê + pizza</strong><small>Depende de quantos confirmarem — aviso assim que fechar</small></article>
        </div>
        <p className="save-note">A ideia é rolar num karaokê com pizza, mas depende de quantos confirmarem presença. Em breve, mais informações.</p>
        <Countdown />
      </section>

      <section className="rsvp section" id="presenca">
        <img className="rsvp-disco-silver" src={`${BASE_PATH}/ponta-globo-prata.png`} alt="" aria-hidden="true" />
        <div className="section-number">04 / VOCÊ VAI?</div>
        <div className="rsvp-heading">
          <h2>Confirme sua<br /><em>presença</em></h2>
          <p>Me conta se vai comemorar os 25 da Ju e se leva alguém junto.</p>
        </div>
        <div className="rsvp-form-wrap">
          <img className="rsvp-arrow" src={`${BASE_PATH}/setarosa1.png`} alt="" aria-hidden="true" />
          <RsvpForm />
        </div>
      </section>

      <section className="gallery section">
        <div className="mood-bg" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <img key={i} src={MOOD_IMAGES[i % MOOD_IMAGES.length]} alt="" />
          ))}
        </div>
        <div className="section-number">05 / REFERÊNCIAS</div>
        <div className="refs-heading">
          <h2>Mood da<br /><em>noite</em></h2>
          <p>Algumas referências de peruca e look pra te inspirar.</p>
        </div>
        <div className="moodboard">
          {MOOD_IMAGES.map((src, index) => (
            <img key={src} className={`mood-item mood-item-${index + 1}`} src={src} alt={`Referência ${index + 1}`} />
          ))}
          <div className="mood-flashbox">
            <PerucaFlashBox images={PERUCA_IMAGES} />
          </div>
        </div>
      </section>

      <section className="mission section">
        <div className="mission-card">
          <p className="section-number light">06 / PRA NÃO ESQUECER</p>
          <h2>Até setembro...</h2>
          <ol>
            <li><b>01</b><span>Reservar sábado, dia 5 de setembro.</span><i>✓</i></li>
            <li><b>02</b><span>Escolher uma peruca.</span><i>○</i></li>
            <li><b>03</b><span>Escolher músicas pra arrasar.</span><i>○</i></li>
            <li><b>04</b><span>Esperar eu confirmar o restaurante.</span><i>○</i></li>
          </ol>
          <p className="mission-foot">O resto vem depois —<br /><em>por enquanto, só procure uma peruca.</em></p>
        </div>
      </section>

      <section className="closing section">
        <div className="closing-disco" aria-hidden="true"><span /></div>
        <div className="closing-reflections" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div>
        <p className="closing-top">Comemore os 25 da Ju —</p>
        <h2>vem <em>cantar</em><br />comigo?</h2>
        <div className="closing-date">05 <span>/</span> 09 <span>/</span> 2026</div>
        <div className="actions centered">
          <button className="button primary" onClick={saveCalendar}>＋ Salvar na agenda</button>
          <a className="button ghost light-button" href="#presenca">Confirmar presença 🎤</a>
        </div>
        <p className="last-line">Seu cabelo pode até faltar, mas você não.</p>
      </section>
      <footer>
        <div className="footer-row">
          <span>Wig Party da Ju · 2026</span>
          <span>✦ Save the Date ✦</span>
        </div>
        <span className="footer-ps">PS: amigos designers, site feito com muita IA e muito Pinterest, favor não dar zoom e olhar detalhes :)</span>
      </footer>
    </main>
  );
}
