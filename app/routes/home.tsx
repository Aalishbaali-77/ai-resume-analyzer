import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "ResumeAn AI" },
        {
            name: "description",
            content: "Smart analytics and feedback for your dream job!",
        },
    ];
}
export default function Home() {

    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next = ')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen">

            {/* Navbar */}
            <Navbar />
            {/* Hero Section */}
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

            {/* Resume Cards Section */}
            {resumes.length > 0 && (
                <div className="resume-cards-section">

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {resumes.map((resume: Resume) => (
                            <ResumeCard key={resume.id} resume={resume} />
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}