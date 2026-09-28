"use client";

import { useEffect, useRef, useState } from "react";

/* ---------- Content (edit freely) ---------- */

// Add or remove lines for the regions you serve.
const HELPLINES = [
  { name: "Emergency services (India)", number: "112" },
  { name: "Tele-MANAS mental health (India)", number: "14416" },
  { name: "988 Suicide & Crisis Lifeline (US)", number: "988" },
  { name: "Samaritans (UK)", number: "116123", display: "116 123" },
];

const BREATH_PHASES = [
  { label: "Breathe in", seconds: 4, scale: 1 },
  { label: "Hold", seconds: 2, scale: 1 },
  { label: "Breathe out", seconds: 6, scale: 0.5 },
];

const GROUNDING_STEPS = [
  { count: 5, text: "things you can see" },
  { count: 4, text: "things you can touch" },
  { count: 3, text: "things you can hear" },
  { count: 2, text: "things you can smell" },
  { count: 1, text: "thing you can taste" },
];

const TABS = [
  { id: "breathe", label: "Breathe" },
  { id: "ground", label: "Ground" },
  { id: "help", label: "Get help" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ---------- Breathing orb ---------- */

function BreathingOrb() {
  const [phaseIndex, setPhaseIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const delay =
      phaseIndex === null
        ? 600
        : BREATH_PHASES[phaseIndex].seconds * 1000;

    const timer = setTimeout(() => {
      setPhaseIndex((current) =>
        current === null ? 0 : (current + 1) % BREATH_PHASES.length
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [phaseIndex, paused]);

  const phase =
    phaseIndex === null ? null : BREATH_PHASES[phaseIndex];

  const scale = phase ? phase.scale : 0.5;

  const transition = `transform ${
    phase ? phase.seconds : 1
  }s ease-in-out`;

  const label = paused
    ? "Paused"
    : phase
      ? phase.label
      : "Get ready";

  const togglePause = () => {
    setPaused((current) => !current);
    setPhaseIndex(null);
  };

  return (
    <div className="panic-breathe">
      <div className="panic-stage">
        <div className="panic-ring" />

        <div
          className="panic-halo"
          style={{
            transform: `scale(${scale})`,
            transition,
          }}
        />

        <div
          className="panic-orb"
          style={{
            transform: `scale(${scale})`,
            transition,
          }}
        />

        <p
          className="panic-phase"
          role="status"
          aria-live="polite"
        >
          {label}
        </p>
      </div>

      <p className="panic-hint">
        Follow the circle. In through your nose, out slowly
        through your mouth.
      </p>

      <button
        type="button"
        className="panic-secondary"
        onClick={togglePause}
      >
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}

/* ---------- Main component ---------- */

export default function Panic() {
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<TabId>("breathe");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <>
      <style>{styles}</style>

      <dialog
        ref={dialogRef}
        className="panic-dialog"
        aria-labelledby="panic-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            setOpen(false);
          }
        }}
      >
        {open && (
          <div className="panic-inner">
            <header className="panic-header">
              <h2 id="panic-title">Let&apos;s slow down</h2>

              <button
                type="button"
                className="panic-close"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </header>

            <div
              className="panic-tabs"
              role="tablist"
              aria-label="Ways to calm down"
            >
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`panic-tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls={`panic-panel-${id}`}
                  className="panic-tab"
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id={`panic-panel-${tab}`}
              aria-labelledby={`panic-tab-${tab}`}
            >
              {tab === "breathe" && <BreathingOrb />}

              {tab === "ground" && (
                <div className="panic-list">
                  <p className="panic-hint">
                    Name each one, out loud or in your head,
                    at your own pace.
                  </p>

                  {GROUNDING_STEPS.map(({ count, text }) => (
                    <div
                      key={count}
                      className="panic-box panic-ground"
                    >
                      <span className="panic-count">
                        {count}
                      </span>

                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "help" && (
                <div className="panic-list">
                  <div className="panic-box panic-urgent">
                    <strong>
                      If you are in danger or thinking about
                      ending your life, call now.
                    </strong>

                    <span>
                      You can also tell someone near you what
                      is happening.
                    </span>
                  </div>

                  {HELPLINES.map(
                    ({ name, number, display }) => (
                      <a
                        key={name}
                        className="panic-box panic-call"
                        href={`tel:${number}`}
                      >
                        <span>{name}</span>

                        <strong>
                          {display ?? number}
                        </strong>
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

/* ---------- Styles ---------- */

const styles = `
.panic-dialog {
  --mist: #EAF1F3;
  --surface: #F6F9FA;
  --tide: #1E3B4C;
  --tide-deep: #142A37;
  --tide-soft: #46606F;
  --sea-glass: #A9CFC4;
  --sage-wash: #DCEBE6;
  --lilac: #D9D3EC;
  --dusk: #54489C;
  --dusk-deep: #43397F;
}

.panic-dialog {
  width: min(440px, calc(100vw - 32px));
  max-height: 92vh;
  padding: 0;
  overflow: auto;
  border: 0;
  border-radius: 28px;
  background: var(--surface);
  color: var(--tide);
  box-shadow: 0 24px 60px rgba(20, 42, 55, 0.3);
}

.panic-dialog::backdrop {
  background: rgba(30, 59, 76, 0.45);
  backdrop-filter: blur(3px);
}

.panic-inner {
  padding: 24px 24px 28px;
}

.panic-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.panic-header h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 650;
  color: var(--tide);
}

.panic-close,
.panic-secondary {
  padding: 8px 16px;
  border: 1px solid var(--tide-soft);
  border-radius: 999px;
  background: transparent;
  color: var(--tide);
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;
}

.panic-close:hover,
.panic-secondary:hover {
  background: var(--sage-wash);
}

.panic-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 22px;
  border-radius: 999px;
  background: var(--mist);
}

.panic-tab {
  flex: 1;
  padding: 10px 8px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  background: transparent;
  color: var(--tide-soft);
  font: inherit;
  font-weight: 600;
}

.panic-tab[aria-selected="true"] {
  background: var(--lilac);
  color: var(--tide);
}

.panic-breathe {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.panic-stage {
  position: relative;
  width: 260px;
  height: 260px;
  display: grid;
  place-items: center;
}

.panic-ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--sea-glass);
  border-radius: 50%;
}

.panic-halo {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: var(--lilac);
  opacity: 0.75;
}

.panic-orb {
  position: absolute;
  inset: 40px;
  border-radius: 50%;
  background: var(--sea-glass);
}

.panic-phase {
  position: relative;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 650;
  color: var(--tide);
}

.panic-hint {
  margin: 0;
  text-align: center;
  line-height: 1.5;
  color: var(--tide-soft);
}

.panic-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panic-box {
  display: flex;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--sage-wash);
  color: var(--tide);
}

.panic-ground {
  align-items: center;
  gap: 14px;
  font-size: 1.05rem;
}

.panic-count {
  min-width: 28px;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--dusk);
  text-align: center;
}

.panic-urgent {
  flex-direction: column;
  gap: 6px;
  line-height: 1.45;
}

.panic-urgent span {
  color: var(--tide-soft);
}

.panic-call {
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-decoration: none;
}

.panic-call strong {
  font-size: 1.2rem;
  color: var(--dusk);
  white-space: nowrap;
}

.panic-call:hover {
  background: var(--sea-glass);
}

.panic-dialog button:focus-visible,
.panic-dialog a:focus-visible {
  outline: 3px solid var(--dusk);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .panic-orb,
  .panic-halo {
    transition: none !important;
    transform: none !important;
  }
}
`;