"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-09-04T19:00:00-04:00");

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
    "DTSTART;VALUE=DATE:20260904", "DTEND;VALUE=DATE:20260905", "SUMMARY:Wig Party da Ju",
    "LOCATION:A confirmar", "DESCRIPTION:Save the Date! Horário e local serão revelados em breve. Já pode procurar sua peruca!",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  link.download = "wig-party-da-ju.ics";
  link.click();
  URL.revokeObjectURL(link.href);
}

function shareWhatsApp() {
  const text = "Save the date! A Wig Party da Ju será dia 4 de setembro de 2026. Já pode começar a procurar sua peruca. Local e horário em breve!";
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${window.location.href}`)}`, "_blank", "noopener,noreferrer");
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="inicio">
        <div className="flash" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <nav aria-label="Navegação principal">
          <a className="wordmark" href="#inicio">WIG PARTY <i>✦</i></a>
          <a className="nav-date" href="#detalhes">04.09.26</a>
        </nav>
        <div className="hero-copy reveal">
          <p className="eyebrow">Juliana convida</p>
          <h1><span>Save</span><em>the date</em></h1>
          <p className="party-name">Wig Party da Ju</p>
          <div className="date-lockup"><span>SEX</span><strong>04 · 09 · 2026</strong></div>
          <p className="hero-note">Separe a data e comece a procurar sua peruca.</p>
          <div className="actions">
            <button className="button primary" onClick={saveCalendar}>＋ Salvar na agenda</button>
            <button className="button ghost" onClick={shareWhatsApp}>Compartilhar ↗</button>
          </div>
        </div>
        <div className="hero-sticker" aria-hidden="true"><span>nova personalidade</span><b>?</b></div>
        <a className="scroll" href="#tema">deslize para descobrir ↓</a>
      </section>

      <section className="ticker" aria-hidden="true"><div>COLOQUE A PERUCA ✦ ESCOLHA SUA PERSONALIDADE ✦ 04.09.2026 ✦ COLOQUE A PERUCA ✦ ESCOLHA SUA PERSONALIDADE ✦</div></section>

      <section className="intro section" id="tema">
        <div className="section-number">01 / O TEMA</div>
        <div className="intro-grid">
          <h2>Coloque a peruca<br />e venha <em>comemorar</em><br />comigo</h2>
          <div className="body-copy">
            <p>Este ano, meu aniversário vai ter uma convidada especial: <strong>a sua peruca.</strong> Pode ser colorida, curta, longa, natural, engraçada ou completamente diferente do seu cabelo.</p>
            <p>Escolha a que mais combina com a sua personalidade da noite.</p>
            <aside><span>IMPORTANTE</span><b>Não precisa fantasia nem superprodução.</b><br />A peruca já faz o tema.</aside>
          </div>
        </div>
      </section>

      <section className="dress section">
        <div className="section-number light">02 / DRESS CODE</div>
        <div className="dress-heading">
          <p>Vista algo que você usaria para sair, comemorar ou dançar</p>
          <h2>Look de festa<br /><span>+</span> peruca</h2>
          <p>Brilho, pink e acessórios divertidos são bem-vindos, mas não obrigatórios.</p>
        </div>
        <div className="look-tags">
          {["Vestido + peruca", "Calça e top + peruca", "Look preto + peruca colorida", "Camisa + peruca", "Seu estilo + uma nova personalidade"].map((item, index) => <span key={item} className={`tag tag-${index + 1}`}>{item}</span>)}
        </div>
        <p className="only-rule">A única regra é <em>aparecer de peruca.</em></p>
      </section>

      <section className="details section" id="detalhes">
        <div className="section-number">03 / ANOTE AÍ</div>
        <div className="details-title"><p>uma noite para lembrar</p><h2>04<br /><em>setembro</em><br />2026</h2></div>
        <div className="detail-cards">
          <article><span>Data</span><strong>4 de setembro<br />de 2026</strong></article>
          <article><span>Horário</span><strong>Em breve</strong><small>Prepare a agenda</small></article>
          <article><span>Local</span><strong>Em breve</strong><small>O endereço é secreto... por enquanto</small></article>
        </div>
        <p className="save-note">Este é apenas o Save the Date. O convite completo, com horário, local e confirmação de presença, será enviado mais perto da festa.</p>
        <Countdown />
      </section>

      <section className="mission section">
        <div className="mission-card">
          <p className="section-number light">04 / SUA MISSÃO</p>
          <h2>Até setembro...</h2>
          <ol>
            <li><b>01</b><span>Reservar o dia 4 de setembro.</span><i>✓</i></li>
            <li><b>02</b><span>Escolher uma peruca.</span><i>○</i></li>
            <li><b>03</b><span>Guardar energia para comemorar.</span><i>○</i></li>
            <li><b>04</b><span>Esperar o endereço secreto ser revelado.</span><i>○</i></li>
          </ol>
          <p className="mission-foot">O endereço vem depois.<br /><em>A peruca você já pode providenciar.</em></p>
        </div>
      </section>

      <section className="gallery section">
        <div className="section-number">05 / MOOD DA NOITE</div>
        <div className="photo-wrap">
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/wig-party-editorial.png`} alt="Amigos adultos se divertindo em uma festa noturna, usando perucas coloridas diante de uma cortina metalizada" />
          <span className="photo-label">flash on ✦</span>
        </div>
        <div className="mood-strip"><span>perucas coloridas</span><span>flash direto</span><span>pink + prata</span><span>decisões questionáveis</span></div>
      </section>

      <section className="closing section">
        <p className="closing-top">Uma noite, muitas perucas e</p>
        <h2>decisões estéticas<br /><em>questionáveis.</em></h2>
        <div className="closing-date">04 <span>/</span> 09 <span>/</span> 2026</div>
        <p>O local será revelado em breve.</p>
        <div className="actions centered">
          <button className="button primary" onClick={saveCalendar}>＋ Salvar na agenda</button>
          <button className="button ghost light-button" onClick={shareWhatsApp}>Mandar no WhatsApp ↗</button>
        </div>
        <p className="last-line">Seu cabelo pode até faltar, mas você não.</p>
      </section>
      <footer><span>Wig Party da Ju · 2026</span><span>✦ Save the Date ✦</span></footer>
    </main>
  );
}
