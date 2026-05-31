import { useState } from "react";
import { useNavigate } from "react-router";
import { useSupabaseStore } from "~/lib/store";

export default function Wipe() {
    const { db } = useSupabaseStore();
    const navigate = useNavigate();
    const [isWiping, setIsWiping] = useState(false);

    const handleWipe = async () => {
        setIsWiping(true);
        const resumes = await db.listResumes();
        for (const resume of resumes) {
            await db.deleteResume(resume.id);
        }
        navigate("/");
    };

    return (
        <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">

                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#ef4444">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                {/* Text */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Clear All Resumes?
                </h2>
                <p className="text-gray-500 text-center mb-8">
                    This will permanently delete all your uploaded resumes and their feedback. This action cannot be undone.
                </p>

                {/* Buttons */}
                {isWiping ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-4 border-red-200 border-t-red-500 animate-spin" />
                        <p className="text-gray-500 text-sm animate-pulse">Deleting all resumes...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleWipe}
                            className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                        >
                            Yes, Delete Everything
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-3 px-6 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}