import Radar from './Radar';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';
import Spectrum from './Spectrum';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <SectionTitle kicker="// SPECTRUM" title="Technical bands">
        Every skill is a carrier on the spectrum. Pick a band to lock onto it.
      </SectionTitle>
      <div className="skills-grid">
        <Reveal>
          <Spectrum />
        </Reveal>
        <Reveal delay={120}>
          <Radar />
        </Reveal>
      </div>
    </section>
  );
}
