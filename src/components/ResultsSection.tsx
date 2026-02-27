"use client";

import { useState } from "react";
import { UserInput, PlanResponse } from "@/lib/schemas";
import BMIGauge from "./BMIGauge";
import DietChart from "./DietChart";
import MacroCards from "./MacroCards";

interface Props {
    userInput: UserInput;
    plan: PlanResponse;
    onRegenerate: () => void;
}

export default function ResultsSection({ userInput, plan, onRegenerate }: Props) {
    const [downloading, setDownloading] = useState(false);
    const [dlError, setDlError] = useState<string | null>(null);

    async function handleDownload() {
        setDlError(null);
        setDownloading(true);

        try {
            const res = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput, plan }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.error || "Failed to generate PDF.");
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BMI-Diet-Report-${(userInput.name || "User").replace(/\s+/g, "_")}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Unexpected error.";
            setDlError(message);
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ── BMI Section ── */}
            <section className="glass-card p-6">
                <h2 className="mb-4 text-lg font-bold text-white/90">
                    📊 BMI Analysis
                </h2>
                <BMIGauge bmi={plan.bmi} category={plan.category} />
                {plan.bodyFatPercent != null && (
                    <div className="mt-8 border-t border-white/10 pt-6">
                        <h3 className="mb-2 text-sm font-semibold text-white/70">Estimated Body Fat %</h3>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-black tracking-tight text-white/90">
                                {plan.bodyFatPercent.toFixed(1)}%
                            </div>
                            <div className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-300">
                                {plan.bodyFatCategory}
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-white/40">
                            Estimates based on Deurenberg (1991) formula using BMI, age, and sex.
                        </p>
                    </div>
                )}
            </section>

            {/* ── Summary ── */}
            <section className="glass-card p-6">
                <h2 className="mb-3 text-lg font-bold text-white/90">📝 Summary</h2>
                <p className="text-sm leading-relaxed text-white/60">{plan.summary}</p>
            </section>

            {/* ── Macro Targets ── */}
            <section className="space-y-3">
                <h2 className="text-lg font-bold text-white/90">
                    🎯 Daily Calorie & Macro Targets
                </h2>
                <MacroCards target={plan.calorieTarget} />
            </section>

            {/* ── Diet Chart ── */}
            <section className="glass-card p-6">
                <h2 className="mb-4 text-lg font-bold text-white/90">
                    🍽️ Personalized Diet Chart
                </h2>
                <DietChart chart={plan.dietChart} />
            </section>

            {/* ── Weekly Tips ── */}
            <section className="glass-card p-6">
                <h2 className="mb-3 text-lg font-bold text-white/90">
                    💡 Weekly Tips & Suggestions
                </h2>
                <ul className="space-y-2">
                    {plan.weeklyTips.map((tip, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-white/60"
                        >
                            <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </section>

            {/* ── Disclaimers ── */}
            <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                <h2 className="mb-2 text-sm font-bold text-amber-300/80">
                    ⚠️ Disclaimers
                </h2>
                <ul className="space-y-1">
                    {plan.disclaimers.map((d, i) => (
                        <li key={i} className="text-xs text-amber-200/50">
                            • {d}
                        </li>
                    ))}
                </ul>
            </section>

            {/* ── Action buttons ── */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {downloading ? (
                        <>
                            <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Generating PDF…
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Download PDF Report
                        </>
                    )}
                </button>

                <button
                    onClick={onRegenerate}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/70 transition-all hover:bg-white/10"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Regenerate
                </button>
            </div>

            {dlError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {dlError}
                </div>
            )}
        </div>
    );
}
