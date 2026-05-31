import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useSupabaseStore } from "~/lib/store";

const navItems = [
    {
        label: "Dashboard",
        path: "/",
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: "Upload Resume",
        path: "/upload",
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
        ),
    },
    {
        label: "My Resumes",
        path: "/",
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: "Clear All Resumes",
        path: "/wipe",
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        ),
    },
];


export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = useSupabaseStore();

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                className="fixed top-4 left-4 z-50 lg:hidden bg-white rounded-xl p-2 shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" onClick={() => setIsOpen(false)}>
                        <p className="text-2xl font-bold text-gradient">ResumeAn AI</p>
                        <p className="text-xs text-gray-400 mt-1">Smart Resume Analyzer</p>
                    </Link>
                </div>

                {/* Nav items */}
                <nav className="flex-1 p-4 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                    ? "primary-gradient text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}>
                  {item.icon}
                </span>
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User info + sign out */}
                <div className="p-4 border-t border-gray-100">
                    {auth.user && (
                        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center text-white text-sm font-bold shrink-0">
                                {auth.user.email?.[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-medium text-gray-700 truncate">
                                    {auth.user.email}
                                </p>
                                <p className="text-xs text-gray-400">Signed in</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => { auth.signOut(); navigate("/auth"); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 w-full"
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}