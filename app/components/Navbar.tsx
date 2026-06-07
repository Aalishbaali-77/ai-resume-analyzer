import React, { useEffect } from "react";
import { Link } from "react-router";
import { useThemeStore } from "~/lib/theme";

const Navbar: () => React.JSX.Element = () => {
    const { isDark, toggle } = useThemeStore();

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            useThemeStore.setState({ isDark: true });
            document.documentElement.classList.add("dark");
        }
    }, []);

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">ResumeAn AI</p>
            </Link>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggle}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                    aria-label="Toggle dark mode"
                >
                    {isDark ? "☀️" : "🌙"}
                </button>
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;