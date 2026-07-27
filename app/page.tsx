"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-07-31T19:00:00-04:00");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const CAP_IMAGE = `${BASE_PATH}/graduation-cap.png`;

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgqaybl";

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
        <h3>{attending === "yes" ? "Bora comemorar a formatura da Nat!" : attending === "maybe" ? "Bora ver se dá certo!" : "Que pena, você vai fazer falta!"}</h3>
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
        <div className="hero-glitter-rain" aria-hidden="true">
          {Array.from({ length: 26 }, (_, index) => (
            <i
              key={index}
              className="spark"
              style={{
                "--x": `${(index * 37) % 100}%`,
                "--delay": `${-((index * 0.83) % 6).toFixed(2)}s`,
                "--duration": `${(4 + ((index * 0.53) % 3)).toFixed(2)}s`,
                "--drift": `${((index % 5) - 2) * 18}px`,
                "--size": `${4 + (index % 3)}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="flash" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <nav aria-label="Navegação principal">
          <a className="wordmark" href="#inicio">NAT CONVIDA <i>✦</i></a>
          <div className="nav-links"><a className="nav-date" href="#detalhes">31.07.26</a></div>
        </nav>
        <div className="hero-copy reveal">
          <p className="eyebrow">Comemore a formatura da Nat!</p>
          <h1 className="h1-small h1-offset">
            <span>Forma</span>
            <em><img src={CAP_IMAGE} alt="" className="cap-decor cap-decor-1" aria-hidden="true" />tura</em>
          </h1>
          <p className="party-name">Save the date</p>
          <div className="date-lockup"><span>SEX</span><strong>31 · 07 · 2026</strong></div>
          <div className="date-glitter-beam" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <p className="hero-note">Separe a data e venha comemorar comigo.</p>
        </div>
        <a className="scroll" href="#tema">deslize para descobrir ↓</a>
      </section>

      <section className="ticker" aria-hidden="true">
        <div>
          <span>VEM CELEBRAR COM A GENTE ✦ FORMATURA DA NAT ✦ 31.07.2026 ✦ </span>
          <span>VEM CELEBRAR COM A GENTE ✦ FORMATURA DA NAT ✦ 31.07.2026 ✦ </span>
        </div>
      </section>

      <section className="intro section has-cap" id="tema">
        <img src={CAP_IMAGE} alt="" className="cap-decor cap-decor-2" aria-hidden="true" />
        <div className="section-number">01 / A FORMATURA</div>
        <div className="intro-grid">
          <div className="intro-copy">
            <h2>A Nat <em>se formou!</em></h2>
            <div className="body-copy">
              <p>Depois de anos de dedicação, chegou a hora de comemorar: a Nasthya se formou em Ciência da Computação! Quero celebrar essa conquista rodeada de quem esteve comigo nessa caminhada.</p>
              <p>Separe a data e venha brindar comigo essa nova fase.</p>
            </div>
          </div>
          <div className="wig-gif">
            <img src={`${BASE_PATH}/formatura.jpg`} alt="Foto da formatura da Nat" className="is-active" />
          </div>
        </div>
      </section>

      <section className="dress section">
        <div className="section-number light">02 / DICAS</div>
        <div className="dress-heading">
          <h2>Informações <span>gerais</span></h2>
        </div>

        <div className="tips-grid">
          <article className="tip-card">
            <span>Dress code: sport fino</span>
            <p>Algo elegante e confortável — nada de traje muito formal, mas capriche no look.</p>
          </article>
          <article className="tip-card">
            <span>Onde fica</span>
            <p>Eulálio Chaves, dentro da UFAM. Tem estacionamento na área do campus.</p>
          </article>
          <article className="tip-card">
            <span>Horário</span>
            <p>A festa começa às 19h — chegue com tempo pra aproveitar tudo.</p>
          </article>
          <article className="tip-card tip-card-note">
            <span>Confirme presença</span>
            <p>Ajuda muito saber quem vai! Preencha o formulário mais abaixo.</p>
          </article>
        </div>

        <p className="only-rule">A única regra é <em>vir comemorar!</em></p>
      </section>

      <section className="details section" id="detalhes">
        <div className="section-number">03 / ANOTE AÍ</div>
        <div className="details-title"><p>uma noite para celebrar</p><h2>31<br /><em>julho</em><br />2026</h2></div>
        <div className="detail-cards">
          <article><span>Data</span><strong>Sexta, 31 de julho<br />de 2026</strong></article>
          <article><span>Horário</span><strong>19h</strong><small>Provável — pode ajustar</small></article>
          <article><span>Local</span><strong>Eulálio Chaves</strong><small>UFAM</small></article>
        </div>
        <p className="save-note">Em breve, mais informações.</p>
        <Countdown />
      </section>

      <section className="rsvp section" id="presenca">
        <div className="section-number">04 / VOCÊ VAI?</div>
        <div className="rsvp-heading">
          <h2>Confirme sua<br /><em>presença</em></h2>
          <p>Me conta se vai comemorar a formatura da Nat e se leva alguém junto.</p>
        </div>
        <RsvpForm />
      </section>

      <section className="closing section">
        <div className="closing-disco" aria-hidden="true"><span /></div>
        <div className="closing-reflections" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div>
        <p className="closing-top">Comemore a formatura da Nat —</p>
        <h2>bora <br />comemorar?</h2>
        <div className="closing-date">31 <span>/</span> 07 <span>/</span> 2026</div>
        <p className="last-line">Anos de esforço, uma noite de festa.</p>
      </section>
      <footer><span>Formatura da Nat · 2026</span><span>✦ Save the Date ✦</span></footer>
    </main>
  );
}
