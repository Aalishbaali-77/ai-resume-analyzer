import { useEffect, useState } from "react";
import { type MetaFunction, useNavigate, Link, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta: MetaFunction = () => {
  return [
    { title: "ResumeAI | Resume Review" },
    { name: "description", content: "Detailed overview of your resume" },
  ];
};

const getScoreGrade = (score: number) => {
  if (score >= 80) return { label: "Excellent", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" };
  if (score >= 60) return { label: "Good", color: "#6366f1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)" };
  if (score >= 40) return { label: "Fair", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" };
  return { label: "Poor", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" };
};

const TipCard = ({
                   tip,
                   type,
                   explanation,
                   index,
                 }: {
  tip: string;
  type: "good" | "improve";
  explanation?: string;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  const isGood = type === "good";

  return (
      <div
          onClick={() => explanation && setOpen(!open)}
          style={{
            animationDelay: `${index * 60}ms`,
            background: isGood
                ? "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))"
                : "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))",
            border: `1px solid ${isGood ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`,
          }}
          className={`rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${explanation ? "cursor-pointer" : ""} transition-all hover:scale-[1.01]`}
      >
        <div className="flex items-start gap-3">
          {/* Icon dot */}
          <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: isGood ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)" }}
          >
            {isGood ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 4.5V7.5M7 9.5H7.01M12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-800 leading-snug">{tip}</p>
              {explanation && (
                  <svg
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
              )}
            </div>
            {open && explanation && (
                <p className="mt-2 text-sm text-gray-500 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                  {explanation}
                </p>
            )}
            {explanation && !open && (
                <p className="text-xs mt-1" style={{ color: isGood ? "#10b981" : "#f59e0b" }}>
                  Tap to read more →
                </p>
            )}
          </div>
        </div>
      </div>
  );
};

const ScoreRing = ({
                     score,
                     size = 128,
                     strokeWidth = 10,
                     showLabel = true,
                   }: {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}) => {
  const { color } = getScoreGrade(score);
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const uniqueId = `grad-${size}-${score}`;

  return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke="rgba(0,0,0,0.06)" strokeWidth={strokeWidth} fill="transparent"
          />
          <defs>
            <linearGradient id={uniqueId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF97AD" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor="#5171FF" />
            </linearGradient>
          </defs>
          <circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke={`url(#${uniqueId})`} strokeWidth={strokeWidth} fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-gray-900" style={{ fontSize: size * 0.22 }}>{score}</span>
          {showLabel && <span className="text-gray-400" style={{ fontSize: size * 0.085 }}>/100</span>}
        </div>
      </div>
  );
};

const CategorySection = ({
                           title,
                           icon,
                           score,
                           tips,
                           hasExplanation = true,
                           accentColor,
                         }: {
  title: string;
  icon: string;
  score: number;
  tips: { type: "good" | "improve"; tip: string; explanation?: string }[];
  hasExplanation?: boolean;
  accentColor: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const grade = getScoreGrade(score);

  return (
      <div
          className="rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            border: expanded ? `1.5px solid ${grade.border}` : "1.5px solid rgba(0,0,0,0.07)",
            boxShadow: expanded ? `0 4px 24px ${grade.bg}` : "0 1px 6px rgba(0,0,0,0.05)",
          }}
      >
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between gap-4 p-4 transition-colors"
            style={{ background: expanded ? grade.bg : "white" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: `${accentColor}18` }}>
              <img src={icon} alt={title} className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800 text-sm">{title}</p>
              <p className="text-xs font-medium" style={{ color: grade.color }}>{grade.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress pill */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${score}%`, background: `linear-gradient(90deg, ${grade.color}88, ${grade.color})` }}
                />
              </div>
              <span className="text-xs font-bold w-8 text-right" style={{ color: grade.color }}>{score}</span>
            </div>

            <ScoreRing score={score} size={40} strokeWidth={4} showLabel={false} />

            <div
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ background: expanded ? grade.border : "rgba(0,0,0,0.05)" }}
            >
              <svg
                  className={`w-3 h-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                  style={{ color: expanded ? grade.color : "#9ca3af" }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {expanded && (
            <div
                className="px-4 pb-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
                style={{ background: `${grade.bg}40` }}
            >
              <div className="h-px bg-gray-100 mb-1" />
              {tips.map((t, i) => (
                  <TipCard
                      key={i}
                      index={i}
                      tip={t.tip}
                      type={t.type}
                      explanation={hasExplanation ? t.explanation : undefined}
                  />
              ))}
            </div>
        )}
      </div>
  );
};

const ScoreSummaryCard = ({ feedback }: { feedback: Feedback }) => {
  const categories = [
    { label: "ATS", score: feedback.ATS.score, emoji: "🤖" },
    { label: "Tone & Style", score: feedback.toneAndStyle.score, emoji: "✍️" },
    { label: "Content", score: feedback.content.score, emoji: "📝" },
    { label: "Structure", score: feedback.structure.score, emoji: "🏗️" },
    { label: "Skills", score: feedback.skills.score, emoji: "⚡" },
  ];

  return (
      <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #fdf2ff 100%)",
            border: "1.5px solid rgba(99,102,241,0.12)",
            boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
          }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Big ring */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <ScoreRing score={feedback.overallScore} size={120} strokeWidth={10} />
            <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  ...(() => { const g = getScoreGrade(feedback.overallScore); return { color: g.color, background: g.bg, border: `1px solid ${g.border}` }; })()
                }}
            >
              {getScoreGrade(feedback.overallScore).label} Resume
            </div>
          </div>

          {/* Bar rows */}
          <div className="flex flex-col gap-3 flex-1 w-full">
            {categories.map(({ label, score, emoji }) => {
              const g = getScoreGrade(score);
              return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-base w-6 shrink-0">{emoji}</span>
                    <span className="text-xs font-medium text-gray-500 w-20 shrink-0">{label}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${score}%`,
                            background: `linear-gradient(90deg, ${g.color}88, ${g.color})`,
                          }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8 text-right shrink-0" style={{ color: g.color }}>
                  {score}
                </span>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
  );
};

const Resume = () => {
  const { auth, isLoading, kv, fs } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeData, setResumeData] = useState<{ companyName?: string; jobTitle?: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);
      setResumeData(data);

      const resumeBlob = await fs.read(data.resumePath);
      if (resumeBlob) {
        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        setResumeUrl(URL.createObjectURL(pdfBlob));
      }

      const imgBlob = await fs.read(data.imagePath);
      if (imgBlob) setImageUrl(URL.createObjectURL(imgBlob));

      setFeedback(data.feedback);
    };
    loadResume();
  }, [id]);

  const getCategoryIcon = (score: number) =>
      score >= 75 ? "/icons/ats-good.svg" : score >= 45 ? "/icons/ats-warning.svg" : "/icons/ats-bad.svg";

  const getCategoryColor = (score: number) => getScoreGrade(score).color;

  return (
      <main className="!pt-0 bg-gray-50 min-h-screen">
        {/* Top nav */}
        <nav
            className="resume-nav sticky top-0 z-20"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(0,0,0,0.07)",
            }}
        >
          <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>

          {resumeData && (
              <div className="flex items-center gap-2">
                <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                    style={{
                      background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="font-semibold text-gray-700">{resumeData.companyName}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">{resumeData.jobTitle}</span>
                </div>
              </div>
          )}
        </nav>

        <div className="flex flex-row w-full max-lg:flex-col-reverse">
          {/* Left: Resume preview */}
          <section
              className="feedback-section h-[100vh] sticky top-[57px] flex items-center justify-center"
              style={{
                background: "linear-gradient(160deg, #f0f4ff 0%, #fdf2ff 60%, #f0fdf4 100%)",
              }}
          >
            {imageUrl && resumeUrl ? (
                <div
                    className="animate-in fade-in zoom-in-95 duration-700 relative group"
                    style={{
                      borderRadius: "20px",
                      padding: "6px",
                      background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(236,72,153,0.2), rgba(16,185,129,0.2))",
                      boxShadow: "0 20px 60px rgba(99,102,241,0.2)",
                      maxHeight: "calc(100vh - 100px)",
                    }}
                >
                  <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`resume-${id}.pdf`}
                      className="block"
                  >
                    <img
                        src={imageUrl}
                        className="rounded-2xl shadow-inner object-contain"
                        style={{ maxHeight: "calc(100vh - 120px)", maxWidth: "100%" }}
                        alt="Resume preview"
                    />
                    {/* Hover overlay */}
                    <div
                        className="absolute inset-[6px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: "rgba(99,102,241,0.08)" }}
                    >
                      <div
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                          style={{ background: "rgba(99,102,241,0.9)", backdropFilter: "blur(8px)" }}
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </div>
                    </div>
                  </a>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                  <img src="/images/resume-scan.gif" className="w-40 opacity-80" alt="Loading..." />
                  <p className="text-sm text-gray-400 font-medium">Loading your resume…</p>
                </div>
            )}
          </section>

          {/* Right: Feedback */}
          <section className="feedback-section bg-white">
            {/* Header */}
            <div className="flex flex-col gap-1 pb-2">
              <h1
                  className="text-3xl font-bold"
                  style={{ background: "linear-gradient(135deg, #1e1b4b, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                Resume Review
              </h1>
              <p className="text-sm text-gray-400">AI-powered analysis across 5 key dimensions</p>
            </div>

            {feedback ? (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

                  <ScoreSummaryCard feedback={feedback} />

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Detailed Breakdown</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-col gap-3">
                    <CategorySection
                        title="ATS Compatibility"
                        icon={getCategoryIcon(feedback.ATS.score)}
                        score={feedback.ATS.score}
                        tips={feedback.ATS.tips}
                        hasExplanation={false}
                        accentColor={getCategoryColor(feedback.ATS.score)}
                    />
                    <CategorySection
                        title="Tone & Style"
                        icon={getCategoryIcon(feedback.toneAndStyle.score)}
                        score={feedback.toneAndStyle.score}
                        tips={feedback.toneAndStyle.tips}
                        accentColor={getCategoryColor(feedback.toneAndStyle.score)}
                    />
                    <CategorySection
                        title="Content"
                        icon={getCategoryIcon(feedback.content.score)}
                        score={feedback.content.score}
                        tips={feedback.content.tips}
                        accentColor={getCategoryColor(feedback.content.score)}
                    />
                    <CategorySection
                        title="Structure"
                        icon={getCategoryIcon(feedback.structure.score)}
                        score={feedback.structure.score}
                        tips={feedback.structure.tips}
                        accentColor={getCategoryColor(feedback.structure.score)}
                    />
                    <CategorySection
                        title="Skills"
                        icon={getCategoryIcon(feedback.skills.score)}
                        score={feedback.skills.score}
                        tips={feedback.skills.tips}
                        accentColor={getCategoryColor(feedback.skills.score)}
                    />
                  </div>

                  {/* Footer note */}
                  <div
                      className="rounded-2xl p-4 flex items-start gap-3 text-sm text-gray-500"
                      style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)" }}
                  >
                    <svg width="16" height="16" className="shrink-0 mt-0.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Click any category to expand detailed tips. Tap tips with explanations to learn more about each suggestion.</p>
                  </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-5 py-16">
                  <img src="/images/resume-scan.gif" className="w-56" alt="Analyzing..." />
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-gray-700 font-semibold">Analyzing your resume…</p>
                    <p className="text-sm text-gray-400">This usually takes a few seconds</p>
                  </div>
                </div>
            )}
          </section>
        </div>
      </main>
  );
};

export default Resume;
