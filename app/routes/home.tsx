import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "ResumeAn AI" },
        { name: "description", content: "Smart analytics and feedback for your dream job!" },
    ];
}

// The stored KV value shape (raw, before blob URLs are resolved)
interface StoredResume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;   // Puter FS path
    resumePath: string;  // Puter FS path
    feedback: Feedback;
}

// What ResumeCard receives — imagePath here is a blob: URL
interface ResolvedResume extends Omit<StoredResume, "imagePath"> {
    imagePath: string;   // resolved blob: URL
}

export default function Home() {
    const { isLoading, auth, kv, fs } = usePuterStore();
    const navigate = useNavigate();

    const [resumes, setResumes]         = useState<ResolvedResume[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate("/auth?next=/");
    }, [isLoading, auth.isAuthenticated]);

    // Fetch all resumes from KV store once authenticated
    useEffect(() => {
        if (!auth.isAuthenticated) return;

        const loadResumes = async () => {
            setFetchLoading(true);
            try {
                // kv.list returns string[] of keys matching the pattern
                const keys = await kv.list("resume:*");
                if (!keys || keys.length === 0) {
                    setResumes([]);
                    return;
                }

                const loaded: ResolvedResume[] = [];

                await Promise.all(
                    (keys as string[]).map(async (key) => {
                        try {
                            const raw = await kv.get(key);
                            if (!raw) return;

                            const data: StoredResume = JSON.parse(raw);

                            // Convert stored FS path → blob URL for the thumbnail
                            const imgBlob = await fs.read(data.imagePath);
                            const imageUrl = imgBlob
                                ? URL.createObjectURL(imgBlob)
                                : "/images/resume_01.png"; // fallback

                            loaded.push({
                                ...data,
                                imagePath: imageUrl,
                            });
                        } catch {
                            // skip corrupt entries silently
                        }
                    })
                );

                // Keep only the 6 most recent entries
                setResumes(loaded.slice(0, 6));
            } finally {
                setFetchLoading(false);
            }
        };

        loadResumes();
    }, [auth.isAuthenticated]);

    const showSkeleton = fetchLoading && auth.isAuthenticated;

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="main-section text-center py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Track Your Applications &amp; Resume Ratings
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg">
                        Smart analytics and feedback for your dream job!
                    </p>
                </div>
            </section>

            {/* Cards */}
            <div className="resume-cards-section px-6 pb-16">
                {showSkeleton ? (
                    // Loading skeletons
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : resumes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume as unknown as Resume} />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </main>
    );
}

/* ─── Skeleton card ─────────────────────────────────────────────── */

const SkeletonCard = () => (
    <div className="resume-card animate-pulse">
        <div className="resume-card-header">
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded-lg" />
                <div className="h-4 w-24 bg-gray-100 rounded-lg" />
            </div>
            <div className="w-[100px] h-[100px] rounded-full bg-gray-200 shrink-0" />
        </div>
        <div className="gradient-border h-72 bg-gray-100 rounded-xl" />
    </div>
);

/* ─── Empty state ───────────────────────────────────────────────── */

const EmptyState = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center gap-6 py-20 text-center max-w-md mx-auto">
            <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                    background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))",
                    border: "1.5px solid rgba(99,102,241,0.15)",
                }}
            >
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="url(#eg)" strokeWidth={1.5}>
                    <defs>
                        <linearGradient id="eg" x1="0" y1="0" x2="1" y2="1">
                            <stop stopColor="#6366f1" />
                            <stop offset="1" stopColor="#a78bfa" />
                        </linearGradient>
                    </defs>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-gray-800">No resumes yet</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Upload your first resume to get AI-powered feedback, ATS scores, and improvement tips.
                </p>
            </div>
            <button
                onClick={() => navigate("/upload")}
                className="primary-button w-fit px-8 py-3 text-base"
            >
                Upload your first resume
            </button>
        </div>
    );
};
