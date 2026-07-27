"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-09-03T19:00:00-04:00");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// TODO: quando a Ju enviar as fotos/gifs da peruca, troque estes caminhos.
// Coloque os arquivos em /public e liste aqui (pode ser .gif, .png ou .jpg).
const WIG_IMAGES = [
  `${BASE_PATH}/wig-party-editorial.png`,
  `${BASE_PATH}/wig-party-editorial.png`,
  `${BASE_PATH}/wig-party-editorial.png`,
];

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgqaybl";

// Não dá pra puxar a imagem de um link do Pinterest automaticamente (o Pinterest bloqueia
// esse tipo de acesso, e reproduzir a imagem sem baixá-la seria usar conteúdo de terceiros
// sem permissão). Pra mostrar a foto de verdade em vez do cartão com link:
// 1. baixe a imagem de cada pin;
// 2. salve em /public/referencias/ (ex: ref-1.jpg, ref-2.jpg...);
// 3. preencha o campo "image" abaixo com o caminho, ex: `${BASE_PATH}/referencias/ref-1.jpg`.
// Enquanto "image" estiver vazio, o carrossel mostra o cartão com o link do pin.
const REFERENCES: { url: string; image?: string }[] = [
  { url: "https://br.pinterest.com/pin/800514902566498845/" },
  { url: "https://br.pinterest.com/pin/800514902566465398/" },
  { url: "https://br.pinterest.com/pin/391953973841641276/" },
  { url: "https://br.pinterest.com/pin/680325087496969171/" },
  { url: "https://br.pinterest.com/pin/831406781254519051/" },
  { url: "https://br.pinterest.com/pin/1012465559996291089/" },
  { url: "https://br.pinterest.com/pin/859765385170286241/" },
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
    "DTSTART:20260903T190000", "DTEND:20260903T230000", "SUMMARY:Wig Party da Ju",
    "LOCATION:A confirmar", "DESCRIPTION:Comemore os 25 da Ju! Horário: 19h. Local ainda a confirmar, aviso em breve. Já pode procurar sua peruca!",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  link.download = "wig-party-da-ju.ics";
  link.click();
  URL.revokeObjectURL(link.href);
}

function WigAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % WIG_IMAGES.length);
    }, 1600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="wig-gif" aria-hidden="true">
      {WIG_IMAGES.map((src, i) => (
        <img key={i} src={src} alt="" className={i === index ? "is-active" : ""} />
      ))}
      <span className="wig-gif-tag">peruca em construção ✦</span>
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
          <div className="nav-links"><a href={`${BASE_PATH}/opcoes`}>Ver opções ✦</a><a className="nav-date" href="#detalhes">03.09.26</a></div>
        </nav>
        <div className="hero-copy reveal">
          <p className="eyebrow">Comemore os 25 da Ju</p>
          <h1 className="h1-small"><span>Wig</span><em>Party</em></h1>
          <p className="party-name">Save the date</p>
          <div className="date-lockup"><span>QUI</span><strong>03 · 09 · 2026</strong></div>
          <div className="date-glitter-beam" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <p className="hero-note">Separe a data e comece a procurar sua peruca.</p>
          <div className="actions">
            <button className="button primary" onClick={saveCalendar}>＋ Salvar na agenda</button>
          </div>
        </div>
        <a className="scroll" href="#tema">deslize para descobrir ↓</a>
      </section>

      <section className="ticker" aria-hidden="true"><div>COLOQUE A PERUCA ✦ ESCOLHA SUA PERSONALIDADE ✦ 03.09.2026 ✦ COLOQUE A PERUCA ✦ ESCOLHA SUA PERSONALIDADE ✦</div></section>

      <section className="intro section" id="tema">
        <div className="section-number">01 / O TEMA</div>
        <div className="intro-grid">
          <div className="intro-copy">
            <h2>São <em>25</em> anos!</h2>
            <div className="body-copy">
              <p>Venha comemorar comigo. Se você foi convidado(a), fez parte de pelo menos <strong>1/4</strong> (ou seria 1/3? tô brincando, não sei fazer conta) da minha vida até aqui.</p>
              <p>E claro, veio com uma condição: apareça de peruca. Colorida, curta, longa, natural ou bem diferente do seu cabelo — escolha a que mais combina com a sua personalidade da noite.</p>
            </div>
          </div>
          <WigAnimation />
        </div>
      </section>

      <section className="dress section">
        <div className="section-number light">02 / DICAS</div>
        <div className="dress-heading">
          <h2>O que <span>vestir?</span></h2>
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
            <p>Também dá pra achar em lojas online — por isso o aviso cedo, pra dar tempo de chegar.</p>
          </article>
          <article className="tip-card">
            <span>Reaproveite uma peruca</span>
            <p>Aquela peruca parada aí conta! Até a peruca da Copa ou de brilho serve pra fazer graça.</p>
          </article>
          <article className="tip-card tip-card-note">
            <span>Sobre o restaurante</span>
            <p>Ainda não definido — ou definido em breve, sei lá. Aviso assim que fechar!</p>
          </article>
        </div>

        <p className="only-rule">A única regra é <em>aparecer de peruca!</em></p>
      </section>

      <section className="details section" id="detalhes">
        <div className="section-number">03 / ANOTE AÍ</div>
        <div className="details-title"><p>uma noite para celebrar</p><h2>03<br /><em>setembro</em><br />2026</h2></div>
        <div className="detail-cards">
          <article><span>Data</span><strong>Quinta, 3 de setembro<br />de 2026</strong></article>
          <article><span>Horário</span><strong>19h</strong><small>Provável — pode ajustar</small></article>
          <article><span>Local</span><strong>Em breve</strong><small>Ainda não definido — aviso assim que fechar</small></article>
        </div>
        <p className="save-note">Em breve, mais informações.</p>
        <Countdown />
      </section>

      <section className="rsvp section" id="presenca">
        <div className="section-number">04 / VOCÊ VAI?</div>
        <div className="rsvp-heading">
          <h2>Confirme sua<br /><em>presença</em></h2>
          <p>Me conta se vai comemorar os 25 da Ju e se leva alguém junto.</p>
        </div>
        <RsvpForm />
      </section>

      <section className="gallery section">
        <div className="section-number">05 / REFERÊNCIAS</div>
        <div className="refs-heading">
          <h2>Mood da<br /><em>noite</em></h2>
          <p>Algumas referências de peruca e look pra te inspirar.</p>
        </div>
        <div className="refs-carousel">
          {REFERENCES.map((ref, index) => (
            <a className={`ref-card${ref.image ? " has-image" : ""}`} href={ref.url} target="_blank" rel="noopener noreferrer" key={ref.url}>
              {ref.image ? (
                <img src={ref.image} alt={`Referência ${index + 1}`} />
              ) : (
                <>
                  <span className="ref-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="ref-label">Ver referência ↗</span>
                </>
              )}
            </a>
          ))}
        </div>
      </section>

      <section className="mission section">
        <div className="mission-card">
          <p className="section-number light">06 / PRA NÃO ESQUECER</p>
          <h2>Até setembro...</h2>
          <ol>
            <li><b>01</b><span>Reservar quinta, dia 3 de setembro.</span><i>✓</i></li>
            <li><b>02</b><span>Escolher uma peruca.</span><i>○</i></li>
            <li><b>03</b><span>Guardar energia para comemorar.</span><i>○</i></li>
            <li><b>04</b><span>Esperar o endereço ser revelado.</span><i>○</i></li>
          </ol>
          <p className="mission-foot">O resto vem depois —<br /><em>por enquanto, só cuide da peruca.</em></p>
        </div>
      </section>

      <section className="closing section">
        <div className="closing-disco" aria-hidden="true"><span /></div>
        <div className="closing-reflections" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div>
        <p className="closing-top">Comemore os 25 da Ju —</p>
        <h2>bora colocar<br />a <em>peruca?</em></h2>
        <div className="closing-date">03 <span>/</span> 09 <span>/</span> 2026</div>
        <div className="actions centered">
          <button className="button primary" onClick={saveCalendar}>＋ Salvar na agenda</button>
          <a className="button ghost light-button" href="#presenca">Confirmar presença ↗</a>
        </div>
        <p className="last-line">Seu cabelo pode até faltar, mas você não.</p>
      </section>
      <footer><span>Wig Party da Ju · 2026</span><span>✦ Save the Date ✦</span></footer>
    </main>
  );
}
