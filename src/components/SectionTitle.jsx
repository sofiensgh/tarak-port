import Reveal from './Reveal';

export default function SectionTitle({ kicker, title, children }) {
  return (
    <Reveal className="section__title">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
      {children && <p className="muted">{children}</p>}
    </Reveal>
  );
}
