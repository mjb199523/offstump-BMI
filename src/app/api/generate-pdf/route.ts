import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { pdfRequestSchema } from "@/lib/schemas";

/* ── colour helpers (0-1 scale for pdf-lib) ── */
const COL = {
    bg: rgb(0.012, 0.047, 0.09), // #030c17
    cardBg: rgb(0.043, 0.071, 0.125), // #0b1220
    accent: rgb(0.133, 0.827, 0.933), // #22d3ee
    green: rgb(0.204, 0.827, 0.604), // #34d399
    amber: rgb(0.984, 0.749, 0.141), // #fbbf24
    red: rgb(0.973, 0.443, 0.443), // #f87171
    white: rgb(0.96, 0.97, 0.98),
    muted: rgb(0.58, 0.64, 0.71),
    divider: rgb(0.12, 0.16, 0.22),
};

function categoryColor(cat: string) {
    switch (cat) {
        case "Underweight":
            return COL.accent;
        case "Normal":
            return COL.green;
        case "Overweight":
            return COL.amber;
        case "Obese":
            return COL.red;
        default:
            return COL.white;
    }
}

/** Wrap text to fit within maxWidth. Returns array of lines. */
function wrapText(
    text: string,
    font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
    fontSize: number,
    maxWidth: number
): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (font.widthOfTextAtSize(test, fontSize) > maxWidth && current) {
            lines.push(current);
            current = word;
        } else {
            current = test;
        }
    }
    if (current) lines.push(current);
    return lines;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = pdfRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid input for PDF generation.",
                    details: parsed.error.issues.map((i) => i.message),
                },
                { status: 400 }
            );
        }

        const { userInput, plan } = parsed.data;

        /* ── Create PDF ── */
        const pdf = await PDFDocument.create();
        const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

        const PAGE_W = 595.28; // A4
        const PAGE_H = 841.89;
        const MARGIN = 40;
        const CONTENT_W = PAGE_W - MARGIN * 2;

        let page = pdf.addPage([PAGE_W, PAGE_H]);
        let y = PAGE_H - MARGIN;

        /** Helper: ensure we don't go below margin; add new page if needed */
        function ensureSpace(needed: number) {
            if (y - needed < MARGIN + 20) {
                page = pdf.addPage([PAGE_W, PAGE_H]);
                y = PAGE_H - MARGIN;
                // Background
                page.drawRectangle({
                    x: 0,
                    y: 0,
                    width: PAGE_W,
                    height: PAGE_H,
                    color: COL.bg,
                });
            }
        }

        function drawHeading(text: string, size = 14) {
            ensureSpace(size + 16);
            y -= size + 8;
            page.drawText(text, {
                x: MARGIN,
                y,
                size,
                font: fontBold,
                color: COL.accent,
            });
            y -= 6;
        }

        function drawLine(text: string, size = 10, color = COL.white) {
            const lines = wrapText(text, fontRegular, size, CONTENT_W);
            for (const line of lines) {
                ensureSpace(size + 6);
                y -= size + 4;
                page.drawText(line, {
                    x: MARGIN,
                    y,
                    size,
                    font: fontRegular,
                    color,
                });
            }
        }

        function drawBoldLine(text: string, size = 10, color = COL.white) {
            const lines = wrapText(text, fontBold, size, CONTENT_W);
            for (const line of lines) {
                ensureSpace(size + 6);
                y -= size + 4;
                page.drawText(line, {
                    x: MARGIN,
                    y,
                    size,
                    font: fontBold,
                    color,
                });
            }
        }

        function drawDivider() {
            ensureSpace(12);
            y -= 8;
            page.drawLine({
                start: { x: MARGIN, y },
                end: { x: PAGE_W - MARGIN, y },
                thickness: 0.5,
                color: COL.divider,
            });
            y -= 4;
        }

        /* ── Page background ── */
        page.drawRectangle({
            x: 0,
            y: 0,
            width: PAGE_W,
            height: PAGE_H,
            color: COL.bg,
        });

        /* ── Title ── */
        const title = "Personalized BMI & Diet Report";
        const titleSize = 20;
        const titleW = fontBold.widthOfTextAtSize(title, titleSize);
        y -= titleSize;
        page.drawText(title, {
            x: (PAGE_W - titleW) / 2,
            y,
            size: titleSize,
            font: fontBold,
            color: COL.accent,
        });

        y -= 14;
        const dateStr = `Generated on: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`;
        const dateW = fontRegular.widthOfTextAtSize(dateStr, 9);
        page.drawText(dateStr, {
            x: (PAGE_W - dateW) / 2,
            y,
            size: 9,
            font: fontRegular,
            color: COL.muted,
        });

        drawDivider();

        /* ── User Details ── */
        drawHeading("User Details");
        const details = [
            `Name: ${userInput.name || "N/A"}`,
            `Age: ${userInput.age}    Gender: ${userInput.gender}`,
            `Height: ${userInput.heightCm} cm    Weight: ${userInput.weightKg} kg`,
            `Activity Level: ${userInput.activityLevel}    Goal: ${userInput.goal}`,
            `Diet Preference: ${userInput.dietPreference}`,
            `Allergies: ${userInput.allergies || "None"}`,
            `Medical Notes: ${userInput.medicalNotes || "None"}`,
        ];
        for (const d of details) drawLine(d, 10);

        drawDivider();

        /* ── BMI ── */
        drawHeading("BMI Analysis");
        drawBoldLine(
            `BMI: ${plan.bmi.toFixed(1)}    Category: ${plan.category}`,
            12,
            categoryColor(plan.category)
        );
        if (plan.bodyFatPercent != null) {
            y -= 8;
            drawBoldLine(
                `Body Fat %: ${plan.bodyFatPercent.toFixed(1)}%    Category: ${plan.bodyFatCategory}`,
                12,
                COL.accent
            );
            y -= 4;
            drawLine(
                "Estimates based on BMI + age + sex; not a medical diagnosis.",
                9,
                COL.muted
            );
        }
        y -= 8;
        drawLine(plan.summary, 10, COL.muted);

        drawDivider();

        /* ── Calorie Targets ── */
        drawHeading("Daily Calorie & Macro Targets");
        drawBoldLine(
            `Calories: ${plan.calorieTarget.dailyCalories} kcal`,
            11
        );
        drawLine(
            `Protein: ${plan.calorieTarget.proteinG}g    Carbs: ${plan.calorieTarget.carbsG}g    Fat: ${plan.calorieTarget.fatG}g`,
            10
        );

        drawDivider();

        /* ── Diet Chart ── */
        drawHeading("Personalized Diet Chart");

        const meals: [string, string][] = [
            ["Breakfast", plan.dietChart.breakfast],
            ["Mid-Morning", plan.dietChart.midMorning],
            ["Lunch", plan.dietChart.lunch],
            ["Evening Snack", plan.dietChart.eveningSnack],
            ["Dinner", plan.dietChart.dinner],
        ];

        for (const [label, desc] of meals) {
            ensureSpace(28);
            y -= 14;
            page.drawText(`${label}:`, {
                x: MARGIN,
                y,
                size: 10,
                font: fontBold,
                color: COL.green,
            });
            const mealLines = wrapText(desc, fontRegular, 10, CONTENT_W - 10);
            for (const ml of mealLines) {
                y -= 13;
                ensureSpace(13);
                page.drawText(ml, {
                    x: MARGIN + 10,
                    y,
                    size: 10,
                    font: fontRegular,
                    color: COL.white,
                });
            }
        }

        drawDivider();

        /* ── Weekly Tips ── */
        drawHeading("Weekly Tips & Suggestions");
        for (const tip of plan.weeklyTips) {
            drawLine(`- ${tip}`, 10);
        }

        drawDivider();

        /* ── Disclaimers ── */
        drawHeading("Disclaimers", 11);
        for (const d of plan.disclaimers) {
            drawLine(`[!] ${d}`, 9, COL.muted);
        }

        /* ── Footer on last page ── */
        ensureSpace(30);
        y = MARGIN;
        const footer =
            "This report is for informational purposes only. It does not constitute medical advice. Consult a licensed healthcare professional.";
        const footerLines = wrapText(footer, fontRegular, 7, CONTENT_W);
        for (const fl of footerLines) {
            page.drawText(fl, {
                x: MARGIN,
                y,
                size: 7,
                font: fontRegular,
                color: COL.muted,
            });
            y -= 9;
        }

        /* ── Serialize ── */
        const pdfBytes = await pdf.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="BMI-Diet-Report-${(userInput.name || "User").replace(/\s+/g, "_")}.pdf"`,
            },
        });
    } catch (err) {
        console.error("[generate-pdf]", err);
        return NextResponse.json(
            { error: "Failed to generate PDF." },
            { status: 500 }
        );
    }
}
