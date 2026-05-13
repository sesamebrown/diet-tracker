import Link from "next/link";

export default function SleepPage() {
  return (
    <main className="page-shell">
      <div className="page-card page-card--center">
        <h1 className="page-title">Sleep</h1>
        <p className="page-description">Track your sleep here</p>

        <Link
          href="/"
          className="back-link"
        >
          Back
        </Link>
      </div>
    </main>
  )
}
