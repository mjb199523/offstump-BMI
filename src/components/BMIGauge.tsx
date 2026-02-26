"use client";

import { getBmiColor, getBmiGaugePercent, getBmiExplanation, type BmiCategory } from "@/lib/bmi";

interface Props {
    bmi: number;
    category: string;
}

export default function BMIGauge({ bmi, category }: Props) {
    const percent = getBmiGaugePercent(bmi);
    const color = getBmiColor(category as BmiCategory);
    const explanation = getBmiExplanation(bmi, category as BmiCategory);

    return (
        <div className="space-y-4">
            {/* Big BMI number */}
            <div className="flex items-end gap-3">
                <span
                    className="text-5xl font-black tracking-tight"
                    style={{ color }}
                >
                    {bmi.toFixed(1)}
                </span>
                <span
                    className="mb-1 rounded-md px-3 py-1 text-sm font-bold"
                    style={{
                        color,
                        backgroundColor: `${color}18`,
                        border: `1px solid ${color}40`,
                    }}
                >
                    {category}
                </span>
            </div>

            {/* Gauge bar */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-50% via-amber-400 to-red-500">
                {/* Indicator */}
                <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
                    style={{ left: `${percent}%` }}
                >
                    <div
                        className="h-5 w-5 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: color }}
                    />
                </div>
            </div>

            {/* Scale labels */}
            <div className="flex justify-between text-xs text-white/40">
                <span>10</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>45</span>
            </div>

            {/* Explanation */}
            <p className="text-sm leading-relaxed text-white/60">{explanation}</p>
        </div>
    );
}
