"use client";

import { useRef, useState } from "react";
import InputForm from "@/components/InputForm";
import ResultsSection from "@/components/ResultsSection";
import { UserInput, PlanResponse } from "@/lib/schemas";

export default function Home() {
  const [result, setResult] = useState<{
    input: UserInput;
    plan: PlanResponse;
  } | null>(null);

  const rightPanelRef = useRef<HTMLDivElement>(null);

  function handleResult(input: UserInput, plan: PlanResponse) {
    setResult({ input, plan });
    // Scroll the right panel back to top when results load
    setTimeout(() => {
      rightPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }

  function handleRegenerate() {
    setResult(null);
    // Scroll the right panel back to top when going back to form
    setTimeout(() => {
      rightPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }

  return (
    <>
      <section className="min-h-screen w-full flex flex-col lg:flex-row">
        {/* ── Left: Hero (sticky, vertically centered) ── */}
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center lg:w-[45%] lg:sticky lg:top-0 lg:h-screen lg:py-0">
          {/* Logo */}
          <div className="mb-6 animate-in">
            <img
              src="/logo.jpeg"
              alt="OffStump Logo"
              className="h-28 w-auto rounded-2xl object-contain"
            />
          </div>

          <h1
            className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl animate-in"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="gradient-text">BMI Calculator</span>
            <br />
            <span className="text-white/90">+ Personalized</span>
            <br />
            <span className="text-white/90">Diet Chart</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/45 sm:text-base animate-in"
            style={{ animationDelay: "0.2s" }}
          >
            Enter your details to calculate your BMI, get a personalized diet
            plan, and download a beautifully formatted PDF report — all instantly,
            no sign-up required.
          </p>

          {/* Decorative dots */}
          <div
            className="mt-8 flex items-center justify-center gap-1.5 animate-in"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
            <span className="h-1.5 w-10 rounded-full bg-gradient-to-r from-cyan-400/60 to-indigo-400/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60" />
          </div>

          {/* Feature badges */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-in"
            style={{ animationDelay: "0.4s" }}
          >
            {["Instant Results", "PDF Report", "No Sign-up"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/8 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: Form OR Results (scrollable panel) ── */}
        <div
          ref={rightPanelRef}
          className="flex-1 px-4 py-10 lg:h-screen lg:overflow-y-auto lg:py-12 lg:pr-10 lg:pl-6"
        >
          <div className="mx-auto max-w-xl">
            {!result ? (
              /* ── Form View ── */
              <section
                className="glass-card p-6 sm:p-8 animate-in"
                style={{ animationDelay: "0.15s" }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
                    <svg
                      className="h-4 w-4 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white/90">
                      Your Details
                    </h2>
                    <p className="text-xs text-white/40">
                      All fields marked with{" "}
                      <span className="text-red-400">*</span> are required.
                    </p>
                  </div>
                </div>

                <InputForm onResult={handleResult} />
              </section>
            ) : (
              /* ── Results View (replaces form) ── */
              <div className="animate-in">
                <ResultsSection
                  userInput={result.input}
                  plan={result.plan}
                  onRegenerate={handleRegenerate}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Copyright ── */}
      <footer className="w-full py-4 text-center text-xs text-white/25">
        © {new Date().getFullYear()} OffStump. All rights reserved.
      </footer>
    </>
  );
}
