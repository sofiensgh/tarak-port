import { useCallback, useState } from 'react';
import BootSequence from './components/BootSequence';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Hero from './components/Hero';
import More from './components/More';
import NetworkBackground from './components/NetworkBackground';
import Skills from './components/Skills';
import Stats from './components/Stats';
import StatusBar from './components/StatusBar';
import { profile } from './data';

function alreadyBooted() {
  try {
    return sessionStorage.getItem('ue-attached') === '1';
  } catch {
    return false;
  }
}

export default function App() {
  const [booted, setBooted] = useState(alreadyBooted);

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem('ue-attached', '1');
    } catch {
      // Storage can be blocked; the boot screen will just show again next visit.
    }
    setBooted(true);
  }, []);

  return (
    <>
      <NetworkBackground />
      <div className="vignette" aria-hidden="true" />
      {!booted && <BootSequence onDone={finishBoot} />}
      <StatusBar />
      <main>
        <Hero ready={booted} />
        <Stats />
        <Experience />
        <Skills />
        <More />
        <Contact />
      </main>
      <footer className="footer">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="mono muted">RRC_CONNECTED · all KPIs nominal</span>
      </footer>
    </>
  );
}
