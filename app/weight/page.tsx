import Link from "next/link";

export default function WeightPage() {
  return (
    <main className="page-shell">
      <div className="page-card page-card--center">
        <h1 className="page-title">Weight</h1>
        <p className="page-description">Track your weight here</p>

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
