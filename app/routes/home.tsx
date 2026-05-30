import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
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
            <Navbar />
            <section className="main-section text-center py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Track Your Applications & Resume Ratings
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg">
                        Smart analytics and feedback for your dream job!
                    </p>
                </div>
            </section>

            {loadingResumes ? (
                <div className="flex justify-center py-12">
                    <p className="text-gray-500 animate-pulse">Loading your resumes...</p>
                </div>
            ) : resumes.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-4">
                    <p className="text-gray-500 text-lg">No resumes yet.</p>
                    <Link to="/upload" className="primary-button w-fit">
                        Upload your first resume
                    </Link>
                </div>
            ) : (
                <div className="resume-cards-section">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} />
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}