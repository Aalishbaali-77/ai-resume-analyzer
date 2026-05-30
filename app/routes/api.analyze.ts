import type { ActionFunctionArgs } from "react-router";
import { prepareInstructions } from "../../constants";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        const formData = await request.formData();
        const pdfFile = formData.get("resume") as File | null;
        const jobTitle = (formData.get("jobTitle") as string) ?? "";
        const jobDescription = (formData.get("jobDescription") as string) ?? "";

        if (!pdfFile) {
            return Response.json({ error: "No resume file provided" }, { status: 400 });
        }

        // Extract readable text from PDF
        const arrayBuffer = await pdfFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const rawText = decoder.decode(uint8Array);
        const pdfText = rawText
            .replace(/[^\x20-\x7E\n]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 4000);

        const apiKey =
            process.env.OPENROUTER_API_KEY ?? process.env.VITE_OPENROUTER_API_KEY;

        if (!apiKey) {
            return Response.json(
                { error: "OPENROUTER_API_KEY not configured" },
                { status: 500 }
            );
        }

        const instructions = prepareInstructions({ jobTitle, jobDescription });

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "AI Resume Analyzer",
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b:free",
                    messages: [
                        {
                            role: "user",
                            content: `${instructions}\n\nResume content:\n\n${pdfText}`,
                        },
                    ],
                    max_tokens: 2048,
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            console.error("OpenRouter API error:", errText);
            return Response.json(
                { error: `OpenRouter error: ${errText}` },
                { status: 500 }
            );
        }

        const data = await response.json();
        console.log("OpenRouter response:", JSON.stringify(data, null, 2));

        if (!data.choices || data.choices.length === 0) {
            return Response.json({ error: "No response from AI" }, { status: 500 });
        }

        const raw = data.choices[0].message.content;
        console.log("Raw AI response:", raw);

        const cleaned = raw.replace(/```json|```/g, "").trim();
        const feedback: Feedback = JSON.parse(cleaned);

        return Response.json({ feedback });
    } catch (err) {
        console.error("[api.analyze] error:", err);
        return Response.json(
            { error: err instanceof Error ? err.message : "Analysis failed" },
            { status: 500 }
        );
    }
}