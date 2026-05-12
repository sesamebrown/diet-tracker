import Link from "next/link";

export default function WeightPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-8">Weight</h1>
        <p className="text-gray-600 mb-8">Track your weight here</p>
        
        <Link
          href="/"
          className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
        >
          ← Back
        </Link>
      </div>
    </main>
  );
}
