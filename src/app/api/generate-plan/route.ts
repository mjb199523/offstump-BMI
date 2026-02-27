import { NextRequest, NextResponse } from "next/server";
import { userInputSchema } from "@/lib/schemas";
import { generatePlan } from "@/lib/plan-generator";
import { sendNotificationEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = userInputSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid input.",
                    details: parsed.error.issues.map((i) => i.message),
                },
                { status: 400 }
            );
        }

        const plan = generatePlan(parsed.data);

        // Await the notification to ensure Vercel doesn't kill the function early
        await sendNotificationEmail(parsed.data, plan).catch(console.error);

        return NextResponse.json(plan);
    } catch (err) {
        console.error("[generate-plan]", err);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
