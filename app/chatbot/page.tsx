"use client";
 
import { useEffect, useMemo, useRef, useState } from "react";
import type { Assessment, ChatMessage, GeminiResponse } from "@/lib/types";
 
// Another page (e.g. triage/routing) can read this key from sessionStorage.
const ASSESSMENT_STORAGE_KEY = "wellbeing_assessment";
 
const OPENING_MESSAGE =
  "Hey, I'm here to help you figure out what's been going on and connect you with the right kind of support. You don't need to know which department to contact — we'll figure that out together. What's been on your mind lately?";
 
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
 
function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
 
function BotAvatar({ size = "h-9 w-9" }: { size?: string }) {
  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700`}>
      <HeartIcon />
    </div>
  );
}
 
export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "opening", role: "bot", content: OPENING_MESSAGE, timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [complete, setComplete] = useState(false);
 
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, error]);
 
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);
 
  const progress = useMemo(() => {
    if (complete) return 100;
    const coverage = Object.values(assessment?.assessment_coverage ?? {});
    const score =
      coverage.filter((s) => s === "explored").length + coverage.filter((s) => s === "partially_explored").length * 0.5;
    const fromCoverage = Math.round((score / 8) * 100);
    const fromTurns = Math.min(30, (messages.filter((m) => m.role === "user").length) * 8);
    return Math.min(95, Math.max(fromCoverage, fromTurns));
  }, [assessment, complete, messages]);
 
  const statusLabel = complete
    ? "Ready to connect you with support"
    : progress < 30
      ? "Getting to know your situation"
      : progress < 70
        ? "Building a clearer picture"
        : "Nearly there";
 
  async function requestReply(history: ChatMessage[]) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) throw new Error(data?.error ?? "Request failed");
 
      const result = data as GeminiResponse;
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "bot", content: result.message, timestamp: new Date().toISOString() },
      ]);
      if (result.assessment) {
        setAssessment(result.assessment);
        try {
          sessionStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(result.assessment));
        } catch {
          /* storage unavailable, ignore */
        }
      }
      if (result.conversation_complete) setComplete(true);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }
 
  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date().toISOString() },
    ];
    setMessages(next);
    setInput("");
    void requestReply(next);
  }
 
  return (
    <main className="flex h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-800">
      {/* Contextual panel (desktop) */}
      <aside className="hidden w-80 shrink-0 flex-col justify-between bg-gradient-to-b from-teal-800 to-teal-950 p-8 text-teal-50 lg:flex">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <HeartIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Student Support</h1>
          <p className="mt-2 text-teal-100/90">We&apos;re here to understand what you need.</p>
 
          <div className="mt-10">
            <div className="flex items-center justify-between text-sm text-teal-100">
              <span>{statusLabel}</span>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Conversation progress"
            >
              <div className="h-full rounded-full bg-teal-200 transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
 
        <div className="space-y-3 text-sm leading-relaxed text-teal-100/80">
          <p>Your responses help us understand what support might be useful. You stay in control of what you share.</p>
          <p>In immediate danger? Contact your local emergency number or campus security straight away.</p>
        </div>
      </aside>
 
      {/* Conversation */}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <BotAvatar />
            <div className="min-w-0">
              <p className="font-semibold leading-tight">Student Support</p>
              <p className="truncate text-xs text-slate-500 lg:hidden">{statusLabel}</p>
              <p className="hidden text-xs text-slate-500 lg:block">A relaxed chat to work out what would help</p>
            </div>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100 lg:hidden">
            <div className="h-full rounded-full bg-teal-600 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </header>
 
        <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            {messages.map((message) =>
              message.role === "bot" ? (
                <div key={message.id} className="flex items-end gap-2.5">
                  <BotAvatar size="h-8 w-8" />
                  <div className="max-w-[85%]">
                    <div className="whitespace-pre-wrap break-words rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 leading-relaxed shadow-sm">
                      {message.content}
                    </div>
                    <p className="mt-1 pl-1 text-[11px] text-slate-400" suppressHydrationWarning>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex flex-col items-end">
                  <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-teal-700 px-4 py-3 leading-relaxed text-white shadow-sm">
                    {message.content}
                  </div>
                  <p className="mt-1 pr-1 text-[11px] text-slate-400" suppressHydrationWarning>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              )
            )}
 
            {loading && (
              <div className="flex items-end gap-2.5" aria-live="polite" aria-label="Assistant is typing">
                <BotAvatar size="h-8 w-8" />
                <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-2 w-2 animate-pulse rounded-full bg-slate-400"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
 
            {error && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
                <span>We couldn&apos;t get a reply right now. {error}</span>
                <button
                  type="button"
                  onClick={() => void requestReply(messages)}
                  className="shrink-0 font-medium underline underline-offset-2 hover:text-rose-950"
                >
                  Try again
                </button>
              </div>
            )}
 
            <div ref={bottomRef} />
          </div>
        </div>
 
        <footer className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20">
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                autoFocus
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message…"
                aria-label="Message"
                className="max-h-36 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-base outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 19V5m0 0l-6 6m6-6l6 6" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-400 lg:hidden">
              Your responses help us understand what support might be useful. You stay in control of what you share.
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}