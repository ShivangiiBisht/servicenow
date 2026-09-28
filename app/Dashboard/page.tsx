"use client";
 
import { useEffect, useState } from "react";
 
/* ---------- Data (swap for real data later) ---------- */
 
const STUDENT = {
  name: "Meera Kapoor",
  initials: "MK",
  details: "18 · 1st year, CSE",
  severity: "Low–Moderate",
  appointmentInDays: 8,
  situation:
    "Recently moved to Delhi for college. Hasn't built close friendships yet, spends most evenings alone in her hostel room, and has gradually stopped going to extracurricular activities. She still attends classes and completes her work.",
};
 
// 0 = no concern, 5 = high concern. Signals from the intake conversation, not a diagnosis.
const WEB_AXES = [
  { label: "Social connection", value: 4 },
  { label: "Adjustment", value: 4 },
  { label: "Activities", value: 4 },
  { label: "Support network", value: 3 },
  { label: "Low mood", value: 2 },
  { label: "Anxiety / worry", value: 2 },
  { label: "Sleep & energy", value: 1 },
  { label: "Academics", value: 1 },
];
 
const ACTIVITY_STEPS = [
  "Map your existing relationships",
  "Identify one safe person to contact",
  "Plan one small social interaction for the coming week",
];
 
const MAX_VALUE = 5;
const DISCUSS_THRESHOLD = 3;
 
/* ---------- Web (radar) graph ---------- */
 
const CX = 260;
const CY = 215;
const RADIUS = 135;
 
function polar(index: number, value: number, radius = RADIUS) {
  const angle = ((-90 + (index * 360) / WEB_AXES.length) * Math.PI) / 180;
  const distance = (radius * value) / MAX_VALUE;
  return { x: CX + distance * Math.cos(angle), y: CY + distance * Math.sin(angle), cos: Math.cos(angle), sin: Math.sin(angle) };
}
 
const ring = (value: number) =>
  WEB_AXES.map((_, i) => {
    const p = polar(i, value);
    return `${p.x},${p.y}`;
  }).join(" ");
 
function WebGraph() {
  const dataPoints = WEB_AXES.map((axis, i) => polar(i, axis.value));
  const summary = WEB_AXES.map((axis) => `${axis.label} ${axis.value} out of ${MAX_VALUE}`).join(", ");
 
  return (
    <svg viewBox="0 0 520 430" className="mx-auto w-full max-w-[560px]" role="img" aria-label={`Support web. ${summary}`}>
      {[1, 2, 3, 4, 5].map((level) => (
        <polygon
          key={level}
          points={ring(level)}
          fill={level === MAX_VALUE ? "#F6F9FA" : "none"}
          stroke="#A9CFC4"
          strokeWidth={1}
          strokeDasharray={level === DISCUSS_THRESHOLD ? "5 5" : undefined}
          opacity={level === DISCUSS_THRESHOLD ? 1 : 0.7}
          style={level === DISCUSS_THRESHOLD ? { stroke: "#46606F" } : undefined}
        />
      ))}
 
      {WEB_AXES.map((_, i) => {
        const end = polar(i, MAX_VALUE);
        return <line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke="#A9CFC4" strokeWidth={1} opacity={0.8} />;
      })}
 
      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="#D9D3EC"
        fillOpacity={0.7}
        stroke="#54489C"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
 
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5} fill="#54489C" stroke="#F6F9FA" strokeWidth={2}>
          <title>{`${WEB_AXES[i].label}: ${WEB_AXES[i].value} / ${MAX_VALUE}`}</title>
        </circle>
      ))}
 
      {WEB_AXES.map((axis, i) => {
        const p = polar(i, MAX_VALUE, RADIUS + 26);
        const anchor = p.cos > 0.3 ? "start" : p.cos < -0.3 ? "end" : "middle";
        const top = p.y - 6 + p.sin * 6;
        return (
          <text key={axis.label} x={p.x} y={top} textAnchor={anchor} fontSize={13} fill="#1E3B4C" fontWeight={600}>
            <tspan x={p.x}>{axis.label}</tspan>
            <tspan x={p.x} dy="1.3em" fontSize={11.5} fontWeight={400} fill="#46606F">
              {axis.value} / {MAX_VALUE}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
 
/* ---------- Page ---------- */
 
export default function DashboardPage() {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [done, setDone] = useState<boolean[]>(ACTIVITY_STEPS.map(() => false));
 
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + STUDENT.appointmentInDays);
    setAppointmentDate(date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" }));
  }, []);
 
  const completed = done.filter(Boolean).length;
  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#54489C]";
 
  return (
    <main className="min-h-screen bg-[#EAF1F3] px-4 py-8 text-[#1E3B4C] lg:px-10 lg:py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D9D3EC] text-lg font-bold text-[#54489C]">
              {STUDENT.initials}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{STUDENT.name}</h1>
              <p className="text-[#46606F]">{STUDENT.details}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#DCEBE6] px-4 py-2 text-sm font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-[#A9CFC4] ring-2 ring-[#46606F]/30" aria-hidden="true" />
              {STUDENT.severity}
            </span>
            <span className="rounded-full bg-[#D9D3EC] px-4 py-2 text-sm font-medium">
              Appointment in {STUDENT.appointmentInDays} days
            </span>
          </div>
        </header>
 
        <div className="grid gap-6 lg:grid-cols-5">
          <section className="rounded-3xl border border-[#DCEBE6] bg-[#F6F9FA] p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold">Support web</h2>
            <p className="mt-1 text-sm text-[#46606F]">
              Where support may help most, based on the conversation. These are signals, not a diagnosis.
            </p>
            <div className="mt-4">
              <WebGraph />
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#46606F]">
              <span className="flex items-center gap-2">
                <span className="h-3 w-5 rounded-sm border-2 border-[#54489C] bg-[#D9D3EC]" aria-hidden="true" />
                Current picture
              </span>
              <span className="flex items-center gap-2">
                <span className="w-5 border-t-2 border-dashed border-[#46606F]" aria-hidden="true" />
                Worth talking through
              </span>
            </div>
          </section>
 
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-3xl border border-[#DCEBE6] bg-[#F6F9FA] p-6">
              <h2 className="text-xl font-semibold">Situation</h2>
              <p className="mt-3 leading-relaxed text-[#46606F]">{STUDENT.situation}</p>
            </section>
 
            <section className="rounded-3xl border border-[#DCEBE6] bg-[#F6F9FA] p-6">
              <h2 className="text-xl font-semibold">Next appointment</h2>
              <p className="mt-3 text-4xl font-semibold">{STUDENT.appointmentInDays} days</p>
              <p className="mt-1 text-[#46606F]" suppressHydrationWarning>
                {appointmentDate}
              </p>
            </section>
          </div>
        </div>
 
        <section className="rounded-3xl border border-[#DCEBE6] bg-[#F6F9FA] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold">Circle of Connection</h2>
              <p className="mt-1 text-sm text-[#46606F]">Your Care Bridge activity for the days before your appointment.</p>
            </div>
            <p className="text-sm font-medium text-[#54489C]">{completed} of {ACTIVITY_STEPS.length} done</p>
          </div>
 
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#DCEBE6]">
            <div
              className="h-full rounded-full bg-[#54489C] transition-all duration-500"
              style={{ width: `${(completed / ACTIVITY_STEPS.length) * 100}%` }}
            />
          </div>
 
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {ACTIVITY_STEPS.map((step, index) => (
              <li key={step}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={done[index]}
                  onClick={() => setDone((current) => current.map((value, i) => (i === index ? !value : value)))}
                  className={`flex h-full w-full items-start gap-3 rounded-2xl bg-[#DCEBE6] p-4 text-left transition-colors hover:bg-[#A9CFC4] ${focusRing}`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      done[index] ? "border-[#54489C] bg-[#54489C] text-white" : "border-[#46606F] bg-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    {done[index] && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    )}
                  </span>
                  <span className={done[index] ? "text-[#46606F] line-through" : ""}>{step}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}