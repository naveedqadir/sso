import { auth } from "@/auth"
import { LoginButton, LogoutButton } from "@/components/AuthButtons"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

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
            {session ? (
              <>
                <Link href="/profile" className="text-white hover:text-white/80 transition-colors">
                  Profile
                </Link>
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Next.js SSO Demo
          </h2>

          {session ? (
            <>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700">
                  <strong>Logged in as:</strong> {session.user?.name || session.user?.email}
                  <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                    Authenticated
                  </span>
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  <strong>Email:</strong> {session.user?.email || "Not provided"}
                </p>
              </div>
              <p className="text-gray-600 mb-4">
                You are successfully authenticated via <strong>Keycloak SSO</strong>!
              </p>
              <p className="text-gray-600 mb-6">
                This demonstrates Single Sign-On working with the Next.js application.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/profile"
                  className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  View Profile
                </Link>
                <a
                  href="http://localhost:8000"
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Go to Django App
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                This is a demonstration of <strong>Single Sign-On (SSO)</strong> using Keycloak as the Identity Provider.
              </p>
              <p className="text-gray-600 mb-6">
                Click the button below to login via Keycloak. Once logged in, you&apos;ll also be authenticated on the Django app!
              </p>
              <div className="flex flex-wrap gap-3">
                <LoginButton />
                <a
                  href="http://localhost:8000"
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Go to Django App
                </a>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
