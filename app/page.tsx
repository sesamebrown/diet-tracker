import Link from "next/link";

export default function Home() {
  const sections = [
    { name: "Weight", href: "/weight" },
    { name: "Meal", href: "/meal" },
    { name: "Water", href: "/water" },
    { name: "Exercise", href: "/exercise" },
    { name: "Sleep", href: "/sleep" },
    { name: "Friends", href: "/friends" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">
          Home
        </h1>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="px-6 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              {section.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}