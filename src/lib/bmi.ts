export function calculateBmi(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
}

export type BmiCategory = "Underweight" | "Normal" | "Overweight" | "Obese";

export function getBmiCategory(bmi: number): BmiCategory {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
}

export function getBmiColor(category: BmiCategory): string {
    switch (category) {
        case "Underweight":
            return "#60a5fa"; // blue
        case "Normal":
            return "#34d399"; // green
        case "Overweight":
            return "#fbbf24"; // amber
        case "Obese":
            return "#f87171"; // red
    }
}

export function getBmiExplanation(bmi: number, category: BmiCategory): string {
    const rounded = bmi.toFixed(1);

    if (category === "Underweight") {
        return `Your BMI is ${rounded}, which falls in the Underweight range. This may indicate insufficient nutrition. Consider consulting a healthcare provider or registered dietitian.`;
    }
    if (category === "Normal") {
        return `Your BMI is ${rounded}, which is within the Normal range. This generally indicates a healthy body weight relative to your height. Keep up your healthy habits!`;
    }
    if (category === "Overweight") {
        return `Your BMI is ${rounded}, which falls in the Overweight range. Small, consistent lifestyle changes in diet and exercise can help. A healthcare provider can offer personalized guidance.`;
    }
    return `Your BMI is ${rounded}, which falls in the Obese range. It is strongly recommended to consult a qualified doctor or dietitian for a personalized health and nutrition plan.`;
}

/** Returns a 0-100 percentage for gauge visualisation */
export function getBmiGaugePercent(bmi: number): number {
    const min = 10;
    const max = 45;
    const bounded = Math.min(Math.max(bmi, min), max);
    return ((bounded - min) / (max - min)) * 100;
}
