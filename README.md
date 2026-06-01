# ResumeAn AI 🤖📄
### *Smart Resume Analyzer — Powered by AI*

> Analyze your resume against any job description, get an ATS compatibility score, and receive actionable feedback — all in seconds.

🌐 **Live App**: [ai-resume-analyzer-psi-self.vercel.app](https://ai-resume-analyzer-psi-self.vercel.app)

---

## ✨ Features

- 📊 **ATS Score Analysis** — See how well your resume matches a job description
- 🤖 **AI-Powered Feedback** — Get smart, actionable suggestions to improve your resume
- 🔐 **Secure Authentication** — Sign in with Email or GitHub via Supabase Auth
- ⚡ **Instant Results** — No waiting, no uploads to third parties
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Styling | Tailwind CSS |
| Auth & Backend | Supabase |
| AI Model | OpenRouter (gpt-oss-120b) |
| Routing | React Router v7 |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account
- An [OpenRouter](https://openrouter.ai) API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Aalishbaali-77/ai-resume-analyzer.git
cd ai-resume-analyzer
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Supabase Setup

1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **Authentication → Providers** and enable **GitHub OAuth**
3. Go to **Authentication → URL Configuration** and set:
   - **Site URL**: your deployed app URL
   - **Redirect URLs**: `your-app-url/**`
4. Copy your **Project URL** and **Anon Key** into `.env`

---

## 📦 Deployment

This app is deployed on **Vercel**. To deploy your own:

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Click **Deploy** 🚀

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── app/
│   ├── components/     # Reusable UI components
│   ├── constants/      # App constants
│   └── types/          # TypeScript types
├── public/             # Static assets
├── .env                # Environment variables (git-ignored)
├── vite.config.ts      # Vite configuration
└── README.md
```

---

## 🙋‍♀️ Author

**Alishba Ali** — [@Aalishbaali-77](https://github.com/Aalishbaali-77)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ as a learning project*
