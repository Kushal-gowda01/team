import Link from 'next/link';
import SearchForm from '@/components/SearchForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-600">AIR</h1>
          <nav className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/community"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Community
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Understand Your Air.{' '}
            <span className="text-blue-600">Protect Your Health.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Transform complex climate and environmental data into clear, visual, and actionable
            insights. Make informed decisions about your health and environment.
          </p>

          {/* City Search */}
          <SearchForm />

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌡️</div>
              <h3 className="text-xl font-semibold mb-2">Multi-Factor Monitoring</h3>
              <p className="text-gray-600">
                Track AQI, temperature, pollution levels, and rainfall patterns in real-time
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Health Impact</h3>
              <p className="text-gray-600">
                Understand how environmental conditions affect your health and get personalized recommendations
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Community Awareness</h3>
              <p className="text-gray-600">
                Learn sustainable practices and join a healthier community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AQI Categories Section */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-xl shadow-md my-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Understanding AQI Levels
          </h3>
          <div className="space-y-3">
            {[
              { range: '0-50', label: 'Good', color: 'bg-[#00E400]', text: 'text-black' },
              { range: '51-100', label: 'Moderate', color: 'bg-[#FFFF00]', text: 'text-black' },
              { range: '101-150', label: 'Unhealthy for Sensitive Groups', color: 'bg-[#FF7E00]', text: 'text-white' },
              { range: '151-200', label: 'Unhealthy', color: 'bg-[#FF0000]', text: 'text-white' },
              { range: '201-300', label: 'Very Unhealthy', color: 'bg-[#8F3F97]', text: 'text-white' },
              { range: '301+', label: 'Hazardous', color: 'bg-[#7E0023]', text: 'text-white' },
            ].map((category) => (
              <div
                key={category.range}
                className={`flex items-center justify-between p-4 rounded-lg ${category.color} transition-transform hover:scale-105`}
              >
                <span className={`font-semibold text-lg ${category.text}`}>
                  AQI {category.range}
                </span>
                <span className={`font-bold text-lg ${category.text}`}>
                  {category.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2026 AIR - Air Intelligence & Response. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Making environmental data accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
