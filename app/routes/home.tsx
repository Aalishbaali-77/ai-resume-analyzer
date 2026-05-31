import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useSupabaseStore } from "~/lib/store";
import { useNavigate, Link } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "ResumeAn AI" },
        { name: "description", content: "Smart analytics and feedback for your dream job!" },
    ];
}

export default function Home() {
    const { isLoading, auth, db } = useSupabaseStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(true);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/");
        }
    }, [auth.isAuthenticated, isLoading]);

    useEffect(() => {
        if (!auth.isAuthenticated) return;
        const load = async () => {
            setLoadingResumes(true);
            const rows = await db.listResumes();
            const mapped: Resume[] = rows.map((row) => ({
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
            }));
            setResumes(mapped);
            setLoadingResumes(false);
        };
        load();
    }, [auth.isAuthenticated]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">
            {/* Hero */}
            <section className="px-6 pt-16 pb-8 text-center">
                <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Track Your Applications & Resume Ratings
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg">
                        Smart analytics and feedback for your dream job!
                    </p>
                </div>
            </section>

            {loadingResumes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
                    {[1,2,3].map((i) => (
                        <div key={i} className="h-[400px] bg-white/60 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : resumes.length === 0 ? (
                <div className="flex flex-col items-center py-20 gap-6 animate-in fade-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#6366f1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No resumes yet</p>
                    <Link to="/upload" className="primary-button w-fit px-8">
                        Upload your first resume
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 pb-10">
                    {resumes.map((resume, i) => (
                        <div
                            key={resume.id}
                            className="animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <ResumeCard resume={resume} />
                        </div>
                    ))}
                </div>
            )}
        </main>
    );}