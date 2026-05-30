import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSupabaseStore } from "~/lib/store";

export default function Wipe() {
    const { db } = useSupabaseStore();
    const navigate = useNavigate();

    useEffect(() => {
        const wipeAll = async () => {
            const resumes = await db.listResumes();
            for (const resume of resumes) {
                await db.deleteResume(resume.id);
            }
            navigate("/");
        };
        wipeAll();
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500 animate-pulse text-lg">
                Wiping all resumes...
            </p>
        </main>
    );
}