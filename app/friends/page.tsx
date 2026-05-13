import Link from "next/link";

export default function FriendsPage() {
  return (
    <main className="page-shell">
      <div className="page-card page-card--center">
        <h1 className="page-title">Friends</h1>
        <p className="page-description">Connect with your friends here</p>

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
