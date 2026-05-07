import {type MetaFunction, useLocation, useNavigate} from "react-router";
import { usePuterStore } from "~/lib/puter";
import {useEffect} from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "ResumeAI | Auth" },
    { name: "description", content: "Log into your account" },
  ]}

const Auth = () => {
  const {isLoading, auth} = usePuterStore();
const location = useLocation();
const next = location.search.split('next = ')[1];
const navigate = useNavigate();


   useEffect(() => {
     if(auth.isAuthenticated) navigate(next);
     }, [auth.isAuthenticated])

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex items-center justify-center">
      <div className= "gradient-border shadow-lg">
        <section className={"flex flex-col gap-8 bg-white rounded-2xl p-10"}>
          <div className= "flex flex-col gap-4 items-center text-center">
            <h1>Welcome</h1>
            <h2>Log in to analyze your Resume Ranking</h2>
          </div>
          <div>
            {isLoading ? (
                <button className="auth-button animate-pulse">
                  <p>Signing you in.....</p>
                </button>
            ) :(
                <>
                  {auth.isAuthenticated ? (
                      <button className = "auth-button" onClick={auth.signOut}>
                        <p>Sign Out</p>
                      </button>
                  ) : (
                      <button className = "auth-button" onClick={auth.signIn}>
                        <p>Sign In</p>
                      </button>
                  )}
                </>
                )}
          </div>
        </section>

      </div>

    </main>
  )
}
export default Auth;