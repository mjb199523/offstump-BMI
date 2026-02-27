"use client";

import { useState } from "react";
import { UserInput, PlanResponse } from "@/lib/schemas";

const initialForm = {
    name: "",
    age: "" as unknown as number,
    gender: "" as unknown as UserInput["gender"],
    heightCm: "" as unknown as number,
    weightKg: "" as unknown as number,
    activityLevel: "" as unknown as UserInput["activityLevel"],
    goal: "" as unknown as UserInput["goal"],
    dietPreference: "" as unknown as UserInput["dietPreference"],
    allergies: "",
    medicalNotes: "",
} as UserInput;

interface Props {
    onResult: (input: UserInput, plan: PlanResponse) => void;
}

export default function InputForm({ onResult }: Props) {
    const [form, setForm] = useState<UserInput>(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function set<K extends keyof UserInput>(key: K, value: UserInput[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/generate-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                const details = Array.isArray(data?.details)
                    ? ` ${data.details.join(", ")}`
                    : "";
                throw new Error((data?.error || "Failed to generate plan.") + details);
            }

            onResult(form, data as PlanResponse);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Unexpected error occurred.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    const selectClass =
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/90 outline-none backdrop-blur-sm transition-all focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 appearance-none cursor-pointer";
    const inputClass =
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/90 placeholder-white/30 outline-none backdrop-blur-sm transition-all focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20";
    const labelClass = "text-sm font-medium text-white/70 mb-1.5 block";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name + Age */}
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>Name <span className="text-red-400">*</span></label>
                    <input
                        className={inputClass}
                        placeholder="Name"
                        required
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                    />
                </div>
                <div>
                    <label className={labelClass}>
                        Age <span className="text-red-400">*</span>
                    </label>
                    <input
                        className={inputClass}
                        type="number"
                        min={5}
                        max={100}
                        required
                        placeholder="Age"
                        value={form.age || ""}
                        onChange={(e) => set("age", Number(e.target.value))}
                    />
                    {form.age && form.age < 18 ? (
                        <p className="mt-1 text-xs text-amber-400">Estimation may be less accurate for children/teens.</p>
                    ) : null}
                </div>
            </div>

            {/* Row 2: Gender + Height + Weight */}
            <div className="grid gap-5 sm:grid-cols-3">
                <div>
                    <label className={labelClass}>
                        Gender <span className="text-red-400">*</span>
                    </label>
                    <select
                        className={selectClass}
                        required
                        value={form.gender}
                        onChange={(e) =>
                            set("gender", e.target.value as UserInput["gender"])
                        }
                    >
                        <option value="" disabled>Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>
                        Height (cm) <span className="text-red-400">*</span>
                    </label>
                    <input
                        className={inputClass}
                        type="number"
                        min={80}
                        max={250}
                        required
                        placeholder="Height"
                        value={form.heightCm || ""}
                        onChange={(e) => set("heightCm", Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className={labelClass}>
                        Weight (kg) <span className="text-red-400">*</span>
                    </label>
                    <input
                        className={inputClass}
                        type="number"
                        min={20}
                        max={350}
                        required
                        placeholder="Weight"
                        value={form.weightKg || ""}
                        onChange={(e) => set("weightKg", Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Row 3: Activity + Goal */}
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>
                        Activity Level <span className="text-red-400">*</span>
                    </label>
                    <select
                        className={selectClass}
                        required
                        value={form.activityLevel}
                        onChange={(e) =>
                            set(
                                "activityLevel",
                                e.target.value as UserInput["activityLevel"]
                            )
                        }
                    >
                        <option value="" disabled>Activity Level</option>
                        <option value="Sedentary">Sedentary</option>
                        <option value="Light">Light</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Very active">Very Active</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>
                        Goal <span className="text-red-400">*</span>
                    </label>
                    <select
                        className={selectClass}
                        required
                        value={form.goal}
                        onChange={(e) =>
                            set("goal", e.target.value as UserInput["goal"])
                        }
                    >
                        <option value="" disabled>Goal</option>
                        <option value="Lose weight">Lose Weight</option>
                        <option value="Maintain">Maintain</option>
                        <option value="Gain muscle">Gain Muscle</option>
                    </select>
                </div>
            </div>

            {/* Row 4: Diet preference */}
            <div>
                <label className={labelClass}>
                    Diet Preference <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                    {(["Veg", "Non-veg", "Eggetarian", "Vegan"] as const).map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => set("dietPreference", opt)}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${form.dietPreference === opt
                                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 5: Allergies + Medical notes */}
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>Allergies</label>
                    <input
                        className={inputClass}
                        placeholder="Allergies"
                        value={form.allergies}
                        onChange={(e) => set("allergies", e.target.value)}
                    />
                </div>
                <div>
                    <label className={labelClass}>Medical Notes</label>
                    <input
                        className={inputClass}
                        placeholder="Medical Notes"
                        value={form.medicalNotes}
                        onChange={(e) => set("medicalNotes", e.target.value)}
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <svg
                                className="h-5 w-5 animate-spin"
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
                            Generating Your Plan…
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                            Generate Report
                        </>
                    )}
                </span>
                {/* shimmer overlay */}
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
        </form>
    );
}
