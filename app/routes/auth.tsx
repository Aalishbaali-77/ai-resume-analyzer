import { type MetaFunction, useLocation, useNavigate } from "react-router";
import { useSupabaseStore } from "~/lib/store";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";

export const meta: MetaFunction = () => [
  { title: "ResumeAI | Sign In" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = useSupabaseStore();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const next = params.get("next") ?? "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoading && auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, isLoading]);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! You are now signed in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      }
    }

    setLoading(false);
  };

  return (
      <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover bg-center flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">

            {/* Logo */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl primary-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gradient mb-1">ResumeAn AI</h1>
              <p className="text-gray-500 text-sm">Smart Resume Analyzer</p>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              <button
                  onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${mode === "signin" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                Sign In
              </button>
              <button
                  onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${mode === "signup" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                Sign Up
              </button>
            </div>

            {/* Error/Success messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
                  {success}
                </div>
            )}

            {/* Email/Password form */}
            <div className="flex flex-col gap-4 mb-4">
              <div className="form-div">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                />
              </div>
              <div className="form-div">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                />
              </div>
            </div>

            {/* Email button */}
            <button
                onClick={handleEmailAuth}
                disabled={loading}
                className="w-full py-4 px-6 primary-gradient text-white font-semibold rounded-2xl transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-50 mb-4"
            >
              {loading ? (
                  <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === "signup" ? "Creating account..." : "Signing in..."}
              </span>
              ) : (
                  mode === "signup" ? "Create Account" : "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* GitHub button */}
            <button
                onClick={auth.signIn}
                className="w-full py-3 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Powered by Supabase Auth
          </p>
        </div>
      </main>
  );
};

export default Auth;