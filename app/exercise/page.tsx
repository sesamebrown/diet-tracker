import Link from "next/link";

export default function ExercisePage() {
  return (
    <main className="page-shell">
      <div className="page-card page-card--center">
        <h1 className="page-title">Exercise</h1>
        <p className="page-description">Track your exercise here</p>

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
