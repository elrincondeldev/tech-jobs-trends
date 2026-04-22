import { NavBar } from "@/features/nav/ui/NavBar";
import { EndpointCard } from "@/features/api-docs/ui/EndpointCard";
import { endpoints } from "@/features/api-docs/model/endpoints";

export const metadata = {
  title: "API Reference · Tech Jobs Trends",
  description: "Public REST API for LATAM tech job market data. No auth required.",
};

const BASE_URL = "https://elrincondeldev.com";

export default function ApiDocsPage() {
  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[var(--secondary)] uppercase tracking-widest mb-3">
            REST API · v1
          </p>
          <h1 className="font-display text-5xl font-bold text-[var(--primary)] mb-4 leading-tight">
            API Reference
          </h1>
          <p className="text-[var(--text-muted)] text-base max-w-xl">
            Public API for LATAM and Spain tech job market data. No authentication required.
            All endpoints return JSON and support CORS.
          </p>
        </div>

        {/* Base URL block */}
        <div className="mb-14">
          <h2 className="font-display font-semibold text-lg text-[var(--primary)] mb-4">Base URL</h2>
          <div className="bg-[#111111] px-5 py-4 flex items-center justify-between">
            <code className="font-mono text-sm text-[#A5F3FC]">{BASE_URL}</code>
            <span className="text-xs font-mono text-white">HTTPS only</span>
          </div>
        </div>

        {/* Quick start */}
        <div className="mb-14">
          <h2 className="font-display font-semibold text-lg text-[var(--primary)] mb-2">Quick Start</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            All endpoints are read-only GET requests. No API key needed.
            Rate limiting is not enforced in this version.
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-[var(--border)]">
            {[
              { icon: "01", title: "No auth",  body: "All GET endpoints are open. Just fetch and go." },
              { icon: "02", title: "JSON only", body: "Responses are always application/json." },
              { icon: "03", title: "CORS",      body: "All origins allowed — use from browser or server." },
            ].map((c) => (
              <div key={c.icon} className="bg-[var(--surface)] px-6 py-5">
                <span className="font-mono text-xs text-[var(--secondary)] mb-2 block">{c.icon}</span>
                <p className="font-display font-semibold text-sm text-[var(--primary)] mb-1">{c.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Available roles */}
        <div className="mb-14">
          <h2 className="font-display font-semibold text-lg text-[var(--primary)] mb-3">Available Roles</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Pass any of these as the <code className="font-mono text-xs text-[var(--secondary)]">role</code> query parameter to{" "}
            <code className="font-mono text-xs text-[var(--secondary)]">/api/skills</code>:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "software engineer", "full stack", "backend", "frontend", "devops",
              "data engineer", "data analyst", "data scientist", "machine learning engineer",
              "ai engineer", "mobile", "qa", "designer", "security", "architect",
              "tech lead", "product manager", "consultant", "marketing",
            ].map((role) => (
              <code
                key={role}
                className="font-mono text-xs px-2.5 py-1 bg-[#F9F9F9] border border-[var(--border)] text-[var(--text-muted)]"
              >
                {role}
              </code>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        <div>
          <h2 className="font-display font-semibold text-lg text-[var(--primary)] mb-4">Endpoints</h2>
          <div className="space-y-3">
            {endpoints.map((ep, i) => (
              <EndpointCard key={ep.path} endpoint={ep} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-[var(--border)]">
          <p className="text-xs font-mono text-[var(--text-muted)] text-center">
            Tech Jobs Trends API · Data updated periodically ·{" "}
            <a href="/" className="text-[var(--secondary)] hover:underline">Back to dashboard</a>
          </p>
        </div>
      </main>
    </>
  );
}
