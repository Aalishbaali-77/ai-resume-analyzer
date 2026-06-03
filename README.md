Here’s a polished README version with better wording and formatting:

# Smart Resume Analyzer — Powered by AI

Analyze your resume against any job description, get an ATS compatibility score, and receive actionable feedback in seconds.

🌐 **Live App:** ai-resume-analyzer-psi-self.vercel.app

## ✨ Features

* 📊 **ATS Score Analysis** — Check how well your resume matches a job description
* 🤖 **AI-Powered Feedback** — Get smart suggestions to improve your resume
* 🔐 **Secure Authentication** — Sign in with Email or GitHub using Supabase Auth
* ⚡ **Instant Results** — Fast resume analysis with clear feedback
* 📱 **Responsive Design** — Works smoothly on desktop and mobile

## 🛠️ Tech Stack

| Layer          | Technology                |
| -------------- | ------------------------- |
| Frontend       | React + TypeScript + Vite |
| Styling        | Tailwind CSS              |
| Auth & Backend | Supabase                  |
| AI Model       | OpenRouter                |
| Routing        | React Router v7           |
| Deployment     | Vercel                    |

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* Supabase account
* OpenRouter API key

### Installation

Clone the repository:

```bash
git clone https://github.com/Aalishbaali-77/ai-resume-analyzer.git
cd ai-resume-analyzer
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:5173
```

## 🔧 Supabase Setup

1. Create a new project on Supabase.
2. Go to **Authentication → Providers** and enable GitHub OAuth.
3. Go to **Authentication → URL Configuration** and add:

   * **Site URL:** your deployed app URL
   * **Redirect URLs:** your-app-url/**
4. Copy your Supabase Project URL and Anon Key into your `.env` file.

## 📦 Deployment

This app is deployed on Vercel.

To deploy your own version:

1. Push your code to GitHub.
2. Import the repository on Vercel.
3. Add environment variables in Vercel project settings.
4. Click **Deploy**.

## 📁 Project Structure

```bash
ai-resume-analyzer/
├── app/
│   ├── components/     # Reusable UI components
│   ├── constants/      # App constants
│   └── types/          # TypeScript types
├── public/             # Static assets
├── .env                # Environment variables
├── vite.config.ts      # Vite configuration
└── README.md
```

## 🙋‍♀️ Author

**Alishba Ali** — @Aalishbaali-77

## 📄 License

This project is open source and available under the MIT License.
