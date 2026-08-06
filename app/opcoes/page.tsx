import Link from "next/link";
import { optionInfo, type OptionKind } from "./options";

const options = Object.entries(optionInfo) as [OptionKind, (typeof optionInfo)[OptionKind]][];

export default function OptionsPage() {
  return (
    <main className="options-page">
      <header className="options-header">
        <Link href="/">← Voltar ao convite</Link>
        <span>WIG PARTY ✦ LAB</span>
      </header>
      <section className="options-intro">
        <p>Escolha uma atmosfera</p>
        <h1>Seis jeitos de<br /><em>brilhar.</em></h1>
        <span>Abra cada opção para ver a animação ocupando a tela inteira.</span>
      </section>
      <section className="options-grid" aria-label="Opções de animação">
        {options.map(([slug, option]) => (
          <Link className={`option-card card-${slug}`} href={`/opcoes/${slug}`} key={slug}>
            <div className="card-preview" aria-hidden="true">
              <i /><i /><i /><i /><i /><i />
              <span>WIG<br /><em>PARTY</em></span>
            </div>
            <div className="card-copy"><small>{option.number}</small><h2>{option.name}</h2><p>{option.note}</p><b>Ver animação ↗</b></div>
          </Link>
        ))}
      </section>
      <footer className="options-footer">03 · 09 · 2026 <span>✦</span> uma nova personalidade por uma noite</footer>
    </main>
  );
}
