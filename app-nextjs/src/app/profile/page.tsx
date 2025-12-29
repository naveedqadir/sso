import { auth } from "@/auth"
import { LogoutButton } from "@/components/AuthButtons"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">Next.js</span>
            SSO Demo App
          </h1>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-white hover:text-white/80 transition-colors">
              Home
            </Link>
            <Link href="/profile" className="text-white hover:text-white/80 transition-colors">
              Profile
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>

          <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
            <p className="text-gray-700">
              <strong>Name:</strong> {session.user?.name || "Not provided"}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {session.user?.email || "Not provided"}
            </p>
            {session.user?.image && (
              <div className="mt-4">
                <strong className="text-gray-700">Avatar:</strong>
                <img
                  src={session.user.image}
                  alt="User avatar"
                  className="w-16 h-16 rounded-full mt-2"
                />
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-4">
            This is a <strong>protected page</strong> that requires authentication.
          </p>
          <p className="text-gray-600 mb-6">
            You were authenticated via Keycloak SSO and this session is shared across all connected applications.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Back to Home
            </Link>
            <LogoutButton />
          </div>
        </div>
      </main>
    </div>
  )
}
