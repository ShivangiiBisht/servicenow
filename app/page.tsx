/* Converted from the uploaded Stillroom landing page. */
"use client";

import Link from "next/link";
import { useState } from "react";

const COPY = {
  student: {
    label: "Student",
    signupTitle: "Create your student account",
    signupLede: "Check in with yourself, keep track of how you're doing, and book time with a counselor when you want it.",
    loginLede: "Log in to see your check-ins and any sessions you've booked.",
    emailLabel: "College email",
    signupButton: "Create student account",
    loginButton: "Log in as a student",
    afterSignup: "Your account is ready. Check your inbox to confirm your email.",
  },
  counselor: {
    label: "Counselor",
    signupTitle: "Create your counselor account",
    signupLede: "See student requests in one queue and follow each one from first message to follow-up.",
    loginLede: "Log in to see today's requests and your upcoming sessions.",
    emailLabel: "Work email",
    signupButton: "Create counselor account",
    loginButton: "Log in as a counselor",
    afterSignup: "Thanks. We'll check your details with your college before you can see any student requests. You'll get an email when that's done.",
  },
} as const;

type Role = keyof typeof COPY;
type Mode = "login" | "signup";
type PanicTab = "breathe" | "ground" | "talk";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("student");
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [panicOpen, setPanicOpen] = useState(false);
  const [panicTab, setPanicTab] = useState<PanicTab>("breathe");
  const [groundIndex, setGroundIndex] = useState(0);

  const openAuth = (nextMode: Mode, nextRole: Role = "student") => {
    setMode(nextMode);
    setRole(nextRole);
    setDone(false);
    setShowPassword(false);
    setAuthOpen(true);
  };

  const openPanic = () => {
    setPanicTab("breathe");
    setGroundIndex(0);
    setPanicOpen(true);
  };

  const copy = COPY[role];
  const isSignup = mode === "signup";

  const steps = [
    ["5", "Name 5 things you can see.", "Look around slowly. A pen, the window, your hands."],
    ["4", "Notice 4 things you can touch.", "The chair under you, your sleeve, the cool edge of a desk."],
    ["3", "Listen for 3 things you can hear.", "Nearby or far away. Fans, footsteps, your own breathing."],
    ["2", "Find 2 things you can smell.", "If you can't smell anything, think of two smells you like."],
    ["1", "Name 1 thing you can taste.", "Or take one slow sip of water."],
    ["", "Well done. Take one more slow breath.", "Notice how your body feels compared to a few minutes ago."],
  ];

  const currentStep = steps[groundIndex];

  const submitAuth = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDone(true);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `/* ==========================================================================
   Stillroom: base, layout and landing page styles
   Palette
   --mist      page background, a cool pale blue-grey
   --tide      main text and solid buttons, a deep sea blue
   --seaglass  the breathing orb
   --lilac     halo around the orb, quiet accents
   --dusk      the panic button, the one saturated colour on the page
   ========================================================================== */

:root {
  --mist: #eaf1f3;
  --surface: #f6f9fa;
  --tide: #1e3b4c;
  --tide-deep: #142a37;
  --tide-soft: #46606f;
  --seaglass: #a9cfc4;
  --sage-wash: #dcebe6;
  --lilac: #d9d3ec;
  --dusk: #54489c;
  --dusk-deep: #43397f;
  --line: rgba(30, 59, 76, 0.16);

  --font-body: "Atkinson Hyperlegible", "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-display: "Literata", Georgia, "Times New Roman", serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--mist);
  color: var(--tide);
  font-family: var(--font-body);
  font-size: 1.125rem;
  line-height: 1.6;
  overflow-x: clip;
}

body:has(dialog[open]) {
  overflow: hidden;
}

h1,
h2,
h3 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 500;
  line-height: 1.15;
}

p {
  margin: 0;
}

a {
  color: inherit;
}

:focus-visible {
  outline: 3px solid var(--dusk);
  outline-offset: 3px;
  border-radius: 6px;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  background: var(--tide);
  color: #fff;
  border-radius: 8px;
}

.skip-link:focus {
  top: 1rem;
}

.wrap {
  width: min(1120px, 100% - 2.5rem);
  margin-inline: auto;
}

/* ---------- Buttons ---------- */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 48px;
  padding: 0.7rem 1.4rem;
  border: 2px solid transparent;
  border-radius: 999px;
  font: inherit;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn--solid {
  background: var(--tide);
  color: #fff;
}

.btn--solid:hover {
  background: var(--tide-deep);
}

.btn--quiet {
  background: transparent;
  color: var(--tide);
}

.btn--quiet:hover {
  background: rgba(30, 59, 76, 0.08);
}

.btn--outline {
  border-color: var(--tide);
  background: transparent;
  color: var(--tide);
}

.btn--outline:hover {
  background: rgba(30, 59, 76, 0.08);
}

.btn--panic {
  min-height: 64px;
  padding: 1.05rem 2rem;
  background: var(--dusk);
  color: #fff;
  font-size: 1.2rem;
  box-shadow: 0 12px 28px -14px rgba(84, 72, 156, 0.7);
}

.btn--panic:hover {
  background: var(--dusk-deep);
}

.text-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0;
  border: 0;
  background: none;
  color: var(--tide);
  font: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.25em;
  cursor: pointer;
}

.text-link:hover {
  color: var(--dusk);
}

/* ---------- Header ---------- */

.site-header .wrap {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-block: 1.25rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-inline-end: auto;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;
}

.main-nav ul {
  display: flex;
  gap: 1.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.main-nav a {
  text-decoration: none;
  padding-block: 0.4rem;
  border-bottom: 2px solid transparent;
}

.main-nav a:hover {
  border-bottom-color: var(--tide);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ---------- Hero ---------- */

.hero .wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 5rem);
  padding-block: clamp(2rem, 6vw, 4.5rem) clamp(3rem, 8vw, 6rem);
}

.hero h1 {
  max-width: 13ch;
  font-size: clamp(2.7rem, 6.2vw, 4.6rem);
  letter-spacing: -0.015em;
}

.hero-lede {
  max-width: 34rem;
  margin-top: 1.5rem;
  color: var(--tide-soft);
  font-size: 1.25rem;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9rem;
  margin-top: 2.25rem;
}

.hero-note,
.hero-account {
  color: var(--tide-soft);
  font-size: 1rem;
}

.hero-account {
  margin-top: 2rem;
}

.hero-visual {
  display: grid;
  justify-items: center;
  gap: 2.5rem;
  padding-block: 1.5rem;
}

/* The one memorable element: a slow breathing orb.
   10s cycle = 4s in (0 to 40%), 6s out (40% to 100%). */

.orb {
  width: min(340px, 58vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle at 34% 30%,
    #f4f9f7 0,
    #cfe6de 28%,
    var(--seaglass) 58%,
    #78aca0 100%
  );
  box-shadow:
    0 0 0 clamp(14px, 2.6vw, 22px) rgba(217, 211, 236, 0.7),
    0 0 0 clamp(30px, 5.6vw, 52px) rgba(217, 211, 236, 0.32);
  animation: breathe 10s ease-in-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(0.86);
  }
  40% {
    transform: scale(1);
  }
}

.orb-caption {
  max-width: 20rem;
  color: var(--tide-soft);
  font-size: 1rem;
  text-align: center;
}

/* ---------- Responsive ---------- */

@media (max-width: 860px) {
  .site-header .wrap {
      flex-wrap: wrap;
      gap: 0.75rem 1rem;
    }

  .main-nav {
      order: 3;
      width: 100%;
      overflow-x: auto;
    }

  .main-nav ul {
      gap: 1.5rem;
      white-space: nowrap;
    }

  .hero .wrap {
      grid-template-columns: 1fr;
    }

  .hero h1 {
      max-width: 16ch;
    }
}

@media (max-width: 480px) {
  .btn--panic {
      width: 100%;
    }

  .hero-actions {
      align-items: stretch;
    }
}

@media (prefers-reduced-motion: reduce) {
  html {
      scroll-behavior: auto;
    }

  .orb {
      animation: none;
      transform: scale(0.94);
    }
}

/* ==========================================================================
   Stillroom: panic support dialog
   Loaded after styles.css and uses its colour tokens.
   ========================================================================== */

.panic {
  width: min(640px, calc(100vw - 1.5rem));
  max-height: calc(100svh - 1.5rem);
  padding: 0;
  border: 0;
  border-radius: 28px;
  background: var(--surface);
  color: var(--tide);
  overflow: auto;
}

.panic::backdrop {
  background: rgba(30, 59, 76, 0.55);
  backdrop-filter: blur(6px);
}

.panic[open] {
  animation: panic-in 0.35s ease-out;
}

@keyframes panic-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.panic-shell {
  padding: clamp(1.25rem, 4vw, 2rem);
}

/* ---------- Top bar: tabs + close ---------- */

.panic-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.panic-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.panic-tab {
  min-height: 44px;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--tide-soft);
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.panic-tab:hover {
  background: rgba(30, 59, 76, 0.07);
}

.panic-tab[aria-selected="true"] {
  background: var(--lilac);
  color: var(--tide);
}

.panic-close {
  flex-shrink: 0;
  min-height: 44px;
  padding: 0.5rem 1rem;
  border: 2px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--tide);
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.panic-close:hover {
  background: rgba(30, 59, 76, 0.07);
}

/* ---------- Panels ---------- */

.panic-panel {
  padding-top: clamp(1.5rem, 4vw, 2.25rem);
}

.panic-panel[hidden] {
  display: none;
}

.panic-panel h2 {
  font-size: clamp(1.7rem, 4.5vw, 2.2rem);
}

.panic-lede {
  max-width: 32rem;
  margin-top: 0.75rem;
  color: var(--tide-soft);
}

.panic-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

/* ---------- Breathing circle ---------- */

.breath {
  position: relative;
  display: grid;
  place-items: center;
  width: min(240px, 60vw);
  aspect-ratio: 1;
  margin: 2rem auto 0;
}

.breath-ring {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(84, 72, 156, 0.35);
  border-radius: 50%;
}

.breath-circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at 34% 30%,
    #f4f9f7 0,
    #cfe6de 30%,
    var(--seaglass) 62%,
    #78aca0 100%
  );
  transform: scale(0.55);
  transition: transform var(--phase-secs, 4s) ease-in-out;
}

.breath-circle.is-in {
  transform: scale(1);
}

.breath-circle.is-out {
  transform: scale(0.55);
}

.breath-text {
  position: relative;
  display: grid;
  justify-items: center;
  text-align: center;
}

.breath-label {
  font-weight: 700;
  font-size: 1.1rem;
}

.breath-count {
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1.1;
}

/* ---------- Grounding steps ---------- */

.ground {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 20px;
  background: var(--sage-wash);
}

.ground-count {
  min-width: 1.2ch;
  color: var(--dusk);
  font-family: var(--font-display);
  font-size: 4.5rem;
  line-height: 1;
}

.ground-count:empty {
  display: none;
}

.ground:has(.ground-count:empty) {
  grid-template-columns: 1fr;
}

.ground-prompt {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1.25;
}

.ground-hint {
  margin-top: 0.4rem;
  color: var(--tide-soft);
  font-size: 1rem;
}

.ground-dots {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.ground-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--line);
}

.ground-dots span.is-done {
  background: var(--dusk);
}

/* ---------- Talk to someone ---------- */

.talk-list {
  display: grid;
  gap: 0.75rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}

.talk-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 1rem 1.25rem;
  border-radius: 18px;
  background: var(--sage-wash);
}

.talk-script {
  max-width: 32rem;
  margin-top: 1.5rem;
  color: var(--tide-soft);
}

@media (max-width: 480px) {
  .panic-top {
      flex-direction: column-reverse;
      align-items: stretch;
    }

  .panic-close {
      align-self: flex-end;
    }

  .ground {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

  .panic-actions .btn {
      flex: 1 1 100%;
    }
}

@media (prefers-reduced-motion: reduce) {
  .panic[open] {
      animation: none;
    }

  /* No movement: the circle stays put and only dims and brightens with the label. */

  .breath-circle,
  .breath-circle.is-in,
  .breath-circle.is-out {
      transform: scale(0.8);
      transition: none;
    }

  .breath-circle.is-out {
      opacity: 0.5;
    }
}

/* ==========================================================================
   Role buttons and log in / sign up dialog
   ========================================================================== */

.text-link--inline {
  margin-top: 0;
}

/* ---------- Hero: choose a role ---------- */

.roles {
  margin-top: 2.5rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--line);
}

.roles-label {
  color: var(--tide-soft);
  font-size: 1rem;
}

.role-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-block: 0.75rem 1rem;
}

/* ---------- Log in / sign up dialog ---------- */

.auth {
  width: min(560px, calc(100vw - 1.5rem));
  max-height: calc(100svh - 1.5rem);
  padding: 0;
  border: 0;
  border-radius: 28px;
  background: var(--surface);
  color: var(--tide);
  overflow: auto;
}

.auth::backdrop {
  background: rgba(30, 59, 76, 0.55);
  backdrop-filter: blur(6px);
}

.auth[open] {
  animation: panic-in 0.35s ease-out;
}

.auth-shell {
  padding: clamp(1.25rem, 4vw, 2.25rem);
}

.auth-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.auth-top h2 {
  font-size: clamp(1.7rem, 4.5vw, 2.2rem);
}

.auth-lede {
  max-width: 30rem;
  margin-top: 0.75rem;
  color: var(--tide-soft);
}

.auth form {
  margin-top: 1.75rem;
}

.role-switch {
  margin: 0 0 1.5rem;
  padding: 0;
  border: 0;
}

.role-switch legend {
  margin-bottom: 0.5rem;
  padding: 0;
  font-weight: 700;
}

.segments {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--mist);
}

.segment {
  position: relative;
}

.segment input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.segment span {
  display: grid;
  place-items: center;
  min-height: 48px;
  border-radius: 999px;
  font-weight: 700;
  transition: background-color 0.2s ease;
}

.segment input:checked + span {
  background: var(--tide);
  color: #fff;
}

.segment input:focus-visible + span {
  outline: 3px solid var(--dusk);
  outline-offset: 3px;
}

.field {
  display: grid;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.field[hidden] {
  display: none;
}

.field label {
  font-weight: 700;
}

.field input {
  width: 100%;
  min-height: 52px;
  padding: 0.6rem 1rem;
  border: 2px solid rgba(30, 59, 76, 0.35);
  border-radius: 14px;
  background: #fff;
  color: var(--tide);
  font: inherit;
}

.field input:focus-visible {
  border-color: var(--dusk);
  outline: 3px solid rgba(84, 72, 156, 0.3);
  outline-offset: 0;
}

.hint {
  color: var(--tide-soft);
  font-size: 0.95rem;
}

.hint[hidden] {
  display: none;
}

.password-row {
  display: flex;
  gap: 0.5rem;
}

.toggle {
  flex-shrink: 0;
  min-width: 72px;
  border: 2px solid var(--line);
  border-radius: 14px;
  background: transparent;
  color: var(--tide);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.toggle:hover {
  background: rgba(30, 59, 76, 0.07);
}

.auth-submit {
  width: 100%;
  margin-top: 0.5rem;
}

.dev-note {
  margin-top: 0.75rem;
  color: var(--tide-soft);
  font-size: 0.9rem;
  text-align: center;
}

.auth-switch {
  margin-top: 1.25rem;
  color: var(--tide-soft);
  font-size: 1rem;
  text-align: center;
}

.auth-done {
  display: grid;
  justify-items: start;
  gap: 1rem;
  margin-top: 1.75rem;
}

.auth-done[hidden],
.auth form[hidden] {
  display: none;
}

.auth-done h3 {
  font-size: 1.8rem;
}

.auth-done p {
  max-width: 28rem;
  color: var(--tide-soft);
}

.auth-help {
  display: grid;
  justify-items: start;
  gap: 0.25rem;
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
  color: var(--tide-soft);
  font-size: 1rem;
}

/* ---------- Responsive ---------- */

@media (max-width: 480px) {
  .role-buttons .btn {
      flex: 1 1 100%;
    }
}

@media (prefers-reduced-motion: reduce) {
  .auth[open] {
      animation: none;
    }
}` }} />

      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="site-header">
        <div className="wrap">
          <a className="brand" href="/" aria-label="Stillroom home">
            <svg className="brand-mark" width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="15" fill="#D9D3EC" />
              <circle cx="16" cy="16" r="9" fill="#A9CFC4" />
            </svg>
            <span>Stillroom</span>
          </a>

          <nav className="main-nav" aria-label="Main">
            <ul>
              <li><a href="#students">For students</a></li>
              <li><a href="#counselors">For counselors</a></li>
              <li><a href="#help">Urgent help</a></li>
              <li><a href="#privacy">Privacy</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="btn btn--quiet" type="button" onClick={() => openAuth("login")}>
              Log in
            </button>
            <button className="btn btn--solid" type="button" onClick={() => openAuth("signup")}>
              Sign up
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <div className="hero-copy">
              <h1 id="hero-title">It's okay to stop and breathe.</h1>

              <p className="hero-lede">
                Stillroom is a place for students to calm down, check in with themselves,
                and reach a real person when things pile up.
              </p>

              <div className="hero-actions">
                <Link className="btn btn--panic" href="/panic">
                  <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
                    <circle cx="13" cy="13" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity=".55" />
                    <circle cx="13" cy="13" r="6" fill="currentColor" />
                  </svg>
                  I'm having a panic attack
                </Link>

                <p className="hero-note">
                  Opens a guided breathing exercise. No account needed.
                </p>
              </div>

              <div className="roles">
                <p className="roles-label">Or get started as</p>

                <div className="role-buttons">
                  <button
                    className="btn btn--solid"
                    type="button"
                    onClick={() => openAuth("signup", "student")}
                  >
                    I'm a student
                  </button>

                  <button
                    className="btn btn--outline"
                    type="button"
                    onClick={() => openAuth("signup", "counselor")}
                  >
                    I'm a counselor
                  </button>
                </div>

                <p className="hero-note">
                  Already have an account?{" "}
                  <button
                    className="text-link text-link--inline"
                    type="button"
                    onClick={() => openAuth("login")}
                  >
                    Log in
                  </button>.
                </p>
              </div>
            </div>

            <div className="hero-visual">
              <div className="orb" aria-hidden="true" />
              <p className="orb-caption">
                Breathe in for 4, out for 6. Try it with the circle.
              </p>
            </div>
          </div>
        </section>
      </main>

      {authOpen && (
        <div
          className="auth"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setAuthOpen(false);
          }}
        >
          <div className="auth-shell">
            <div className="auth-top">
              <h2 id="auth-title">
                {isSignup ? copy.signupTitle : "Welcome back"}
              </h2>

              <button className="panic-close" type="button" onClick={() => setAuthOpen(false)}>
                Close
              </button>
            </div>

            <p className="auth-lede">
              {isSignup ? copy.signupLede : copy.loginLede}
            </p>

            {done ? (
              <div className="auth-done" role="status">
                <h3>{isSignup ? "You're all set" : "You're logged in"}</h3>

                <p>
                  {isSignup
                    ? copy.afterSignup
                    : `Welcome back. Your ${copy.label.toLowerCase()} dashboard would open here.`}
                </p>

                <button className="btn btn--solid" type="button" onClick={() => setAuthOpen(false)}>
                  Back to home
                </button>
              </div>
            ) : (
              <form onSubmit={submitAuth}>
                <fieldset className="role-switch">
                  <legend>I am a</legend>

                  <div className="segments">
                    <label className="segment">
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={role === "student"}
                        onChange={() => setRole("student")}
                      />
                      <span>Student</span>
                    </label>

                    <label className="segment">
                      <input
                        type="radio"
                        name="role"
                        value="counselor"
                        checked={role === "counselor"}
                        onChange={() => setRole("counselor")}
                      />
                      <span>Counselor</span>
                    </label>
                  </div>
                </fieldset>

                {isSignup && (
                  <div className="field">
                    <label htmlFor="auth-name">Full name</label>
                    <input id="auth-name" name="name" type="text" autoComplete="name" required />
                  </div>
                )}

                <div className="field">
                  <label htmlFor="auth-email">{copy.emailLabel}</label>
                  <input id="auth-email" name="email" type="email" autoComplete="email" required />
                  {role === "counselor" && (
                    <p className="hint">Use your work email.</p>
                  )}
                </div>

                {isSignup && role === "counselor" && (
                  <div className="field">
                    <label htmlFor="auth-org">College or organization</label>
                    <input
                      id="auth-org"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      required
                    />
                  </div>
                )}

                <div className="field">
                  <label htmlFor="auth-password">Password</label>

                  <div className="password-row">
                    <input
                      id="auth-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      minLength={isSignup ? 8 : undefined}
                      required
                    />

                    <button
                      className="toggle"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {isSignup && <p className="hint">At least 8 characters.</p>}
                </div>

                <button className="btn btn--solid auth-submit" type="submit">
                  {isSignup ? copy.signupButton : copy.loginButton}
                </button>

                <p className="dev-note">
                  Preview only: nothing is sent anywhere yet.
                </p>

                <p className="auth-switch">
                  {isSignup ? "Already have an account?" : "New here?"}{" "}
                  <button
                    className="text-link text-link--inline"
                    type="button"
                    onClick={() => setMode(isSignup ? "login" : "signup")}
                  >
                    {isSignup ? "Log in" : "Sign up"}
                  </button>
                </p>
              </form>
            )}

            <div className="auth-help">
              <p>Having a hard time right now? You don't need an account for this.</p>

              <button
                className="text-link text-link--inline"
                type="button"
                onClick={() => {
                  setAuthOpen(false);
                  openPanic();
                }}
              >
                Open the panic tool
              </button>
            </div>
          </div>
        </div>
      )}

      {panicOpen && (
        <div
          className="panic"
          role="dialog"
          aria-modal="true"
          aria-labelledby="panic-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPanicOpen(false);
          }}
        >
          <div className="panic-shell">
            <div className="panic-top">
              <div className="panic-tabs" role="tablist">
                {(["breathe", "ground", "talk"] as PanicTab[]).map((tab) => (
                  <button
                    key={tab}
                    className="panic-tab"
                    type="button"
                    role="tab"
                    aria-selected={panicTab === tab}
                    onClick={() => setPanicTab(tab)}
                  >
                    {tab === "breathe"
                      ? "Breathe"
                      : tab === "ground"
                        ? "Ground"
                        : "Talk to someone"}
                  </button>
                ))}
              </div>

              <button className="panic-close" type="button" onClick={() => setPanicOpen(false)}>
                Close
              </button>
            </div>

            {panicTab === "breathe" && (
              <section className="panic-panel">
                <h2 id="panic-title">Let's slow things down.</h2>
                <p className="panic-lede">
                  Follow the circle. Breathe in for 4 seconds, then out for 6.
                </p>

                <div className="breath">
                  <div className="breath-ring" />
                  <div className="breath-circle is-in" />
                  <div className="breath-text">
                    <span className="breath-label">Breathe in</span>
                    <span className="breath-count">4</span>
                  </div>
                </div>

                <div className="panic-actions">
                  <button className="btn btn--solid" type="button" onClick={() => setPanicTab("ground")}>
                    Try grounding instead
                  </button>
                </div>
              </section>
            )}

            {panicTab === "ground" && (
              <section className="panic-panel">
                <h2>Come back to the room.</h2>
                <p className="panic-lede">
                  Use your senses to bring your attention back to the present.
                </p>

                <div className="ground">
                  <div className="ground-count">{currentStep[0]}</div>

                  <div>
                    <div className="ground-prompt">{currentStep[1]}</div>
                    <div className="ground-hint">{currentStep[2]}</div>

                    <div className="ground-dots">
                      {steps.slice(0, 5).map((_, index) => (
                        <span
                          key={index}
                          className={index <= groundIndex ? "is-done" : ""}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="panic-actions">
                  <button
                    className="btn btn--quiet"
                    type="button"
                    disabled={groundIndex === 0}
                    onClick={() => setGroundIndex(Math.max(0, groundIndex - 1))}
                  >
                    Back
                  </button>

                  <button
                    className="btn btn--solid"
                    type="button"
                    onClick={() => {
                      if (groundIndex < steps.length - 1) {
                        setGroundIndex(groundIndex + 1);
                      } else {
                        setPanicTab("talk");
                      }
                    }}
                  >
                    {groundIndex < steps.length - 1 ? "Next" : "See who you can talk to"}
                  </button>
                </div>
              </section>
            )}

            {panicTab === "talk" && (
              <section className="panic-panel">
                <h2>Talk to someone.</h2>
                <p className="panic-lede">
                  You don't have to handle a difficult moment alone.
                </p>

                <ul className="talk-list">
                  <li>
                    <span>Campus counselor</span>
                    <button className="btn btn--outline" type="button">
                      Find support
                    </button>
                  </li>

                  <li>
                    <span>A trusted person</span>
                    <button className="btn btn--outline" type="button">
                      See suggestions
                    </button>
                  </li>
                </ul>

                <p className="talk-script">
                  If you need immediate emergency help, contact your local emergency
                  service or a trusted person nearby.
                </p>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
}
