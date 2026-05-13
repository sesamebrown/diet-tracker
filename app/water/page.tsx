import Link from "next/link";

export default function WaterPage() {
  return (
    <main className="page-shell">
      <div className="page-card page-card--center">
        <h1 className="page-title">Water</h1>
        <p className="page-description">Track your water intake here</p>

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
