import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useSupabaseStore } from "~/lib/store";

const scoreBadge = (score: number) => {
    if (score >= 75) return { label: "Good", cls: "bg-badge-green text-badge-green-text" };
    if (score >= 50) return { label: "Average", cls: "bg-badge-yellow text-badge-yellow-text" };
    return { label: "Needs Work", cls: "bg-badge-red text-badge-red-text" };
};

const TipCard = ({
                     tip,
                 }: {
    tip: { type: "good" | "improve"; tip: string; explanation?: string };
}) => (
    <div className={`flex gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.01] ${tip.type === "good" ? "bg-badge-green" : "bg-badge-red"}`}>
        <img
            src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
            alt={tip.type}
            className="w-5 h-5 mt-0.5 shrink-0"
        />
        <div>
            <p className={`font-medium text-sm ${tip.type === "good" ? "text-badge-green-text" : "text-badge-red-text"}`}>
                {tip.tip}
            </p>
            {tip.explanation && (
                <p className="text-sm text-gray-600 mt-1">{tip.explanation}</p>
            )}
        </div>
    </div>
);

const CategorySection = ({
                             title,
                             icon,
                             score,
                             tips,
                         }: {
    title: string;
    icon: string;
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation?: string }[];
}) => {
    const badge = scoreBadge(score);
    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <img src={icon} alt={title} className="w-10 h-10" />
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                <span className={`score-badge text-sm font-medium px-3 py-1 rounded-full ${badge.cls}`}>
          {score}/100 · {badge.label}
        </span>
            </div>
            <div className="flex flex-col gap-2">
                {tips.map((t, i) => (
                    <TipCard key={i} tip={t} />
                ))}
            </div>
        </div>
    );
};

export default function ResumePage() {
    const { id } = useParams<{ id: string }>();
    const { db } = useSupabaseStore();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            setLoading(true);
            const row = await db.getResume(id);
            if (!row) {
                setError("Resume not found.");
                setLoading(false);
                return;
            }
            setResume({
                id: row.id,
                companyName: row.company_name ?? undefined,
                jobTitle: row.job_title ?? undefined,
                imagePath: row.image_path,
                resumePath: row.resume_path,
                feedback: row.feedback ?? {
                    overallScore: 0,
                    ATS: { score: 0, tips: [] },
                    toneAndStyle: { score: 0, tips: [] },
                    content: { score: 0, tips: [] },
                    structure: { score: 0, tips: [] },
                    skills: { score: 0, tips: [] },
                },
            });
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
                <div className="flex justify-center items-center h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full primary-gradient animate-pulse" />
                        <p className="text-gray-500 animate-pulse text-lg">Loading resume...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !resume) {
        return (
            <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
                <div className="flex flex-col items-center gap-4 pt-24">
                    <p className="text-red-500 text-lg">{error ?? "Resume not found"}</p>
                    <Link to="/" className="back-button">
                        <img src="/icons/back.svg" alt="back" />
                        Back to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    const { feedback } = resume;

    return (
        <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
            {/* Top nav row */}
            <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
                <Link to="/" className="back-button animate-in fade-in duration-300">
                    <img src="/icons/back.svg" alt="back" />
                    <span className="text-sm">Back</span>
                </Link>
                <div className="flex flex-col items-end animate-in fade-in duration-300">
                    <h2 className="font-bold text-gray-900">{resume.companyName}</h2>
                    <p className="text-gray-500 text-sm">{resume.jobTitle}</p>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-4 py-4 pb-12">

                {/* Left sidebar */}
                <aside className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4">

                    {/* Overall score card */}
                    <div className="gradient-border flex flex-col items-center gap-3 py-6 animate-in fade-in slide-in-from-left-4 duration-500">
                        <ScoreCircle score={feedback.overallScore} />
                        <p className="text-gray-600 font-medium text-sm">Overall Score</p>
                    </div>

                    {/* Category scores */}
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                        {(
                            [
                                ["ATS", feedback.ATS.score, "/icons/ats-good.svg"],
                                ["Tone & Style", feedback.toneAndStyle.score, "/icons/ats-warning.svg"],
                                ["Content", feedback.content.score, "/icons/ats-good.svg"],
                                ["Structure", feedback.structure.score, "/icons/ats-warning.svg"],
                                ["Skills", feedback.skills.score, "/icons/ats-bad.svg"],
                            ] as [string, number, string][]
                        ).map(([label, score, icon]) => {
                            const badge = scoreBadge(score);
                            return (
                                <div key={label} className="flex flex-row gap-2 items-center bg-white rounded-2xl p-3 w-full justify-between shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <img src={icon} alt={label} className="w-8 h-8" />
                                        <span className="text-sm font-medium text-gray-700">{label}</span>
                                    </div>
                                    <span className={`score-badge text-xs px-2 py-0.5 ${badge.cls}`}>
                    {score}/100
                  </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Resume image */}
                    <div className="gradient-border animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                        <img
                            src={resume.imagePath}
                            alt="Resume preview"
                            className="w-full rounded-xl object-contain"
                        />
                    </div>
                </aside>

                {/* Right feedback */}
                <section className="flex flex-col gap-8 flex-1 pb-8">
                    <h2 className="text-2xl font-bold text-gray-900 animate-in fade-in duration-500">
                        Detailed Feedback
                    </h2>
                    <CategorySection title="ATS Compatibility" icon="/icons/ats-good.svg" score={feedback.ATS.score} tips={feedback.ATS.tips} />
                    <CategorySection title="Tone & Style" icon="/icons/ats-warning.svg" score={feedback.toneAndStyle.score} tips={feedback.toneAndStyle.tips} />
                    <CategorySection title="Content" icon="/icons/ats-good.svg" score={feedback.content.score} tips={feedback.content.tips} />
                    <CategorySection title="Structure" icon="/icons/ats-warning.svg" score={feedback.structure.score} tips={feedback.structure.tips} />
                    <CategorySection title="Skills" icon="/icons/ats-bad.svg" score={feedback.skills.score} tips={feedback.skills.tips} />
                </section>
            </div>
        </main>
    );
}