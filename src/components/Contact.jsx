import { useEffect, useState } from 'react';
import { profile } from '../data';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

// A trimmed VoLTE (SIP) call-setup ladder between the visitor and Tarek.
const LADDER = [
  { dir: 'right', label: 'INVITE (SDP offer)' },
  { dir: 'left', label: '100 Trying' },
  { dir: 'left', label: '183 Session Progress' },
  { dir: 'right', label: 'PRACK' },
  { dir: 'left', label: '180 Ringing' },
  { dir: 'left', label: '200 OK (SDP answer)' },
  { dir: 'right', label: 'ACK' },
];
const STEP_MS = 420;

export default function Contact() {
  const [step, setStep] = useState(-1);
  const [copied, setCopied] = useState(false);
  const calling = step >= 0 && step < LADDER.length;
  const connected = step >= LADDER.length;

  useEffect(() => {
    if (!calling) return;
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [step, calling]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section">
      <SectionTitle kicker="// CALL SETUP" title="Establish connection">
        Open to RAN, drive-test, SSV and optimization roles. Start a VoLTE call to bring up the line.
      </SectionTitle>

      <div className="contact-grid">
        <Reveal className="panel ladder">
          <div className="panel__head">
            <span>
              <span className={`dot ${connected ? 'dot--live' : calling ? 'dot--amber' : ''}`} /> SIP SIGNALING
            </span>
            <span className="muted">{connected ? 'CALL ACTIVE' : calling ? 'SETTING UP…' : 'IDLE'}</span>
          </div>

          <div className="ladder__ends">
            <span>UE · You</span>
            <span>IMS · Tarek</span>
          </div>
          <div className="ladder__body">
            <span className="ladder__pole ladder__pole--l" />
            <span className="ladder__pole ladder__pole--r" />
            {LADDER.map((msg, i) => (
              <div key={msg.label} className={`ladder__msg ladder__msg--${msg.dir} ${i <= step ? 'is-sent' : ''}`}>
                <span className="ladder__label">{msg.label}</span>
                <span className="ladder__arrow" />
              </div>
            ))}
          </div>

          <div className="ladder__actions">
            {connected ? (
              <>
                <div className="ladder__ok">
                  ✓ Call established · MOS 4.4 · setup {((LADDER.length * STEP_MS) / 1000).toFixed(1)} s
                </div>
                <button className="btn btn--danger" onClick={() => setStep(-1)}>
                  Hang up
                </button>
              </>
            ) : (
              <button className="btn btn--primary" onClick={() => setStep(0)} disabled={calling}>
                {calling ? 'Dialing…' : '☎ Start VoLTE call'}
              </button>
            )}
          </div>
        </Reveal>

        <Reveal className={`panel contact-card ${connected ? 'is-live' : ''}`} delay={120}>
          <div className="card__kicker">{connected ? 'LINE OPEN' : 'DIRECT CHANNELS'}</div>
          <h3>Let's talk radio.</h3>
          <p className="muted">
            Based in {profile.location}, available for 4G/5G field and analysis projects.
          </p>
          <div className="channels">
            <a className="channel" href={`mailto:${profile.email}`}>
              <span className="channel__k">EMAIL</span>
              <span className="channel__v">{profile.email}</span>
            </a>
            <button className="channel" onClick={copyEmail}>
              <span className="channel__k">COPY</span>
              <span className="channel__v">{copied ? 'Copied to clipboard ✓' : 'Copy email address'}</span>
            </button>
            <a className="channel" href={`tel:${profile.phoneHref}`}>
              <span className="channel__k">PHONE</span>
              <span className="channel__v">{profile.phone}</span>
            </a>
            <div className="channel">
              <span className="channel__k">CELL</span>
              <span className="channel__v">{profile.location}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
