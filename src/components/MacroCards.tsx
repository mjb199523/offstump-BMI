"use client";

import { PlanResponse } from "@/lib/schemas";

interface Props {
    target: PlanResponse["calorieTarget"];
}

export default function MacroCards({ target }: Props) {
    const macros = [
        {
            label: "Calories",
            value: target.dailyCalories,
            unit: "kcal",
            color: "from-orange-400 to-pink-500",
            glow: "shadow-orange-500/20",
        },
        {
            label: "Protein",
            value: target.proteinG,
            unit: "g",
            color: "from-cyan-400 to-blue-500",
            glow: "shadow-cyan-500/20",
        },
        {
            label: "Carbs",
            value: target.carbsG,
            unit: "g",
            color: "from-green-400 to-emerald-500",
            glow: "shadow-green-500/20",
        },
        {
            label: "Fat",
            value: target.fatG,
            unit: "g",
            color: "from-amber-400 to-yellow-500",
            glow: "shadow-amber-500/20",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {macros.map((m) => (
                <div
                    key={m.label}
                    className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:shadow-lg ${m.glow}`}
                >
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                        {m.label}
                    </p>
                    <p className="mt-1 text-2xl font-black text-white/90">
                        {m.value}
                        <span className="ml-1 text-sm font-normal text-white/40">
                            {m.unit}
                        </span>
                    </p>

                    {/* Decorative gradient bar */}
                    <div
                        className={`absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r ${m.color} opacity-60`}
                    />
                </div>
            ))}
        </div>
    );
}
