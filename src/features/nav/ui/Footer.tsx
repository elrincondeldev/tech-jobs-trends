import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getReport } from "@/shared/lib/report";

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const navLinks = [
  { href: "/#overview", label: "Overview" },
  { href: "/#skills", label: "Skills" },
  { href: "/#roles", label: "Roles" },
  { href: "/#salary", label: "Salary" },
  { href: "/api-docs", label: "API Docs" },
];

export async function Footer() {
  noStore();
  const report = await getReport();

  const generatedAt = report
    ? new Date(report.meta.generated_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const totalOffers = report
    ? `+${(Math.round(report.meta.total_offers / 1000) * 1000).toLocaleString("en-US")}`
    : null;

  return (
    <footer className="border-t border-[var(--border)] mt-auto bg-[var(--surface-muted)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <p className="font-display font-bold text-sm text-[var(--primary)] mb-2">
            Tech Jobs <span className="text-[var(--secondary)]">Trends</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
            Market intelligence for the Spanish-speaking tech job market.
            Data aggregated from LATAM and Spain job boards.
          </p>
          {generatedAt && totalOffers && (
            <p className="text-xs font-mono text-[var(--text-muted)] mt-4 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--secondary)]" />
              {totalOffers} offers · Updated {generatedAt}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            Navigation
          </p>
          <ul className="space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Author + Social */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            Author
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Built by{" "}
            <span className="font-semibold text-[var(--primary)]">El Rincón del Dev</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/elrincondeldev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/joseramonmontes/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://github.com/elrincondeldev/tech-jobs-trends"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)] px-6 py-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs font-mono text-[var(--text-muted)]">
          © {new Date().getFullYear()} Tech Jobs Trends · Data for informational purposes only
        </p>
        <Link
          href="/api-docs"
          className="text-xs font-mono text-[var(--secondary)] hover:underline"
        >
          API Docs →
        </Link>
      </div>
    </footer>
  );
}
