"use client";

import { PlanResponse } from "@/lib/schemas";

interface Props {
    chart: PlanResponse["dietChart"];
}

const meals: { key: keyof PlanResponse["dietChart"]; label: string; icon: string; time: string }[] = [
    { key: "breakfast", label: "Breakfast", icon: "🌅", time: "7:00 – 8:30 AM" },
    { key: "midMorning", label: "Mid-Morning", icon: "🍎", time: "10:00 – 11:00 AM" },
    { key: "lunch", label: "Lunch", icon: "🍛", time: "12:30 – 1:30 PM" },
    { key: "eveningSnack", label: "Evening Snack", icon: "🫖", time: "4:00 – 5:00 PM" },
    { key: "dinner", label: "Dinner", icon: "🌙", time: "7:30 – 8:30 PM" },
];

export default function DietChart({ chart }: Props) {
    return (
        <div className="overflow-hidden rounded-xl border border-white/10">
            {/* Header */}
            <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] bg-white/5 text-xs font-semibold uppercase tracking-wider text-white/50">
                <div className="px-4 py-3 border-r border-white/5">Meal</div>
                <div className="px-4 py-3">What to eat</div>
            </div>

            {/* Rows */}
            {meals.map(({ key, label, icon, time }, i) => (
                <div
                    key={key}
                    className={`grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] transition-colors hover:bg-white/[0.03] ${i < meals.length - 1 ? "border-b border-white/5" : ""
                        }`}
                >
                    <div className="flex flex-col gap-0.5 border-r border-white/5 px-4 py-3">
                        <span className="text-sm font-semibold text-white/80">
                            {icon} {label}
                        </span>
                        <span className="text-[11px] text-white/30">{time}</span>
                    </div>
                    <div className="px-4 py-3 text-sm leading-relaxed text-white/70">
                        {chart[key]}
                    </div>
                </div>
            ))}
        </div>
    );
}
