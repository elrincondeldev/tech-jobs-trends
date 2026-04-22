import Link from "next/link";
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

export async function Footer() {
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
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Brand */}
        <div>
          <p className="font-display font-semibold text-sm text-[var(--primary)] mb-1">
            Tech Jobs Trends
          </p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm">
            Market intelligence for the Spanish-speaking tech job market.
            Data aggregated from LATAM and Spain job boards.
          </p>
          {generatedAt && totalOffers && (
            <p className="text-xs font-mono text-[var(--text-muted)] mt-3">
              {totalOffers} offers · Updated {generatedAt}
            </p>
          )}
        </div>

        {/* Author */}
        <div className="flex flex-col items-start md:items-end gap-3">

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/elrincondeldev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/joseramonmontes/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              <LinkedInIcon />
            </a>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Developed by{" "}
            <span className="font-semibold text-[var(--primary)]">El Rincón del Dev</span>
          </p>
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
