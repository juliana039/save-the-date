"use client";

import Link from "next/link";
import { optionInfo, type OptionKind } from "./options";

const particles = Array.from({ length: 44 }, (_, index) => index);

export default function AnimationOption({ kind }: { kind: OptionKind }) {
  const info = optionInfo[kind];

  return (
    <main className={`motion-demo motion-${kind}`}>
      <div className="motion-effects" aria-hidden="true">
        <div className="motion-beam beam-one" />
        <div className="motion-beam beam-two" />
        <div className="motion-beam beam-three" />
        <div className="disco-ball"><span /></div>
        <div className="flash-burst flash-one" />
        <div className="flash-burst flash-two" />
        <div className="starburst-shape" />
        {particles.map((particle) => (
          <i
            className="spark"
            key={particle}
            style={{
              "--x": `${(particle * 37) % 101}%`,
              "--delay": `${-((particle * 0.29) % 6)}s`,
              "--duration": `${3.3 + (particle % 7) * 0.48}s`,
              "--size": `${3 + (particle % 5) * 2}px`,
              "--drift": `${-38 + (particle % 9) * 10}px`,
              "--y": `${8 + ((particle * 23) % 82)}%`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <nav className="motion-nav" aria-label="Navegação das opções">
        <Link href="/opcoes">← Todas as opções</Link>
        <span>{info.number} / 06</span>
      </nav>

      <section className="motion-content">
        <p className="motion-kicker">Juliana apresenta</p>
        <h1><span>Wig</span><em>Party</em></h1>
        <p className="motion-subtitle">Save the date</p>
        <div className="motion-date"><b>03</b><span>setembro<br />2026</span></div>
        <p className="motion-invite">Coloque a peruca.<br />Apareça para comemorar.</p>
      </section>

      <aside className="motion-label">
        <b>{info.name}</b>
        <span>{info.note}</span>
      </aside>
      <p className="motion-hint">mova o olhar pela tela ✦</p>
    </main>
  );
}
