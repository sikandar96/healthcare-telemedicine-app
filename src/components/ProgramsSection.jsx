import { ArrowUpRight, Zap } from "lucide-react";

export default function ProgramsSection({ programs, onOpenProgram }) {
  return (
    <section className="program-section" id="programs"><span className="program-folio" aria-hidden="true" /><div className="program-lead"><div className="eyebrow light"><span className="eyebrow-line" /> A little more good</div><h2>Health awareness<br /><em>that feels human.</em></h2><p>Find focused programs from care teams and mission-led sponsors who want to make prevention easier to start.</p><button className="button button-light" onClick={() => onOpenProgram("Health awareness programs")}>Explore programs <ArrowUpRight size={17} /></button></div><div className="program-list">{programs.map((program, index) => <button className="program-row" key={program.title} onClick={() => onOpenProgram(program.title)}><span className={`program-number ${program.accent}`}>0{index + 1}</span><span><small>{program.tag}</small><strong>{program.title}</strong><em>{program.detail}</em></span><ArrowUpRight size={18} /></button>)}<div className="sponsor-note"><Zap size={17} /> <span>For health organizations: sponsor a program that moves people forward.</span><ArrowUpRight size={15} /></div></div></section>
  );
}
