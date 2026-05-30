import { type MetaFunction, useLocation, useNavigate } from "react-router";
import { useSupabaseStore } from "~/lib/store";
import { useEffect } from "react";

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

  useEffect(() => {
    if (!isLoading && auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, isLoading]);

  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex items-center justify-center">
        <div className="gradient-border shadow-lg">
          <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
            <div className="flex flex-col gap-4 items-center text-center">
              <h1>Welcome</h1>
              <h2>Sign in to analyze your Resume Ranking</h2>
            </div>
            <div>
              {isLoading ? (
                  <button className="auth-button animate-pulse" disabled>
                    Signing you in...
                  </button>
              ) : auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    Sign Out
                  </button>
              ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    Continue with GitHub
                  </button>
              )}
            </div>
          </section>
        </div>
      </main>
  );
};

export default Auth;