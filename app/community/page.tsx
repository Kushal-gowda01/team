export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">AIR Community</h1>
            <nav className="flex gap-6">
              <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
              <a href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</a>
              <a href="/community" className="text-blue-600 font-medium">Community</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg p-12 mb-8 text-white">
          <h2 className="text-4xl font-bold mb-4">Building a Healthier Community</h2>
          <p className="text-xl opacity-90">
            Learn about air quality, climate change, and take action for a sustainable future
          </p>
        </div>

        {/* Educational Content Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Understanding Air Quality */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-4xl mb-4">🌬️</div>
            <h3 className="text-2xl font-bold mb-4">Understanding Air Quality</h3>
            <div className="space-y-3 text-gray-700">
              <p className="font-semibold text-blue-600">What is AQI?</p>
              <p>
                The Air Quality Index (AQI) is a standardized indicator that tells you how clean 
                or polluted your air is, and what health effects might be a concern.
              </p>
              <p className="font-semibold text-blue-600 mt-4">Why It Matters</p>
              <p>
                Poor air quality can affect your health in minutes to hours. Long-term exposure 
                can lead to serious health conditions including respiratory diseases.
              </p>
            </div>
          </div>

          {/* Pollution Sources */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-4xl mb-4">🏭</div>
            <h3 className="text-2xl font-bold mb-4">Common Pollution Sources</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <div>
                  <strong>Vehicle Emissions:</strong> Cars, trucks, and buses release harmful pollutants
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <div>
                  <strong>Industrial Activities:</strong> Factories and manufacturing plants
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <div>
                  <strong>Construction:</strong> Dust and particulate matter from building sites
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <div>
                  <strong>Biomass Burning:</strong> Agricultural burning and wildfires
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Sustainable Practices */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>🌱</span> Sustainable Practices You Can Adopt
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">Transportation</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Use public transportation</li>
                <li>• Carpool when possible</li>
                <li>• Walk or bike for short distances</li>
                <li>• Consider electric vehicles</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">At Home</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Use energy-efficient appliances</li>
                <li>• Install air purifiers</li>
                <li>• Plant trees and greenery</li>
                <li>• Reduce, reuse, recycle</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">Community Action</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Support clean air policies</li>
                <li>• Participate in tree planting</li>
                <li>• Advocate for public transit</li>
                <li>• Spread awareness</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Health Protection Tips */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>❤️</span> Protect Your Health
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 text-blue-600">When AQI is Good (0-50)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Perfect for all outdoor activities</li>
                <li>✓ Keep windows open for fresh air</li>
                <li>✓ Exercise outdoors freely</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3 text-yellow-600">When AQI is Moderate (51-100)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Generally safe for most people</li>
                <li>! Sensitive individuals should monitor</li>
                <li>✓ Outdoor activities acceptable</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3 text-orange-600">When AQI is Unhealthy (101-200)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✗ Limit prolonged outdoor exertion</li>
                <li>✗ Keep windows closed</li>
                <li>! Wear masks when outside</li>
                <li>! Sensitive groups stay indoors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3 text-red-600">When AQI is Hazardous (200+)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✗ Stay indoors</li>
                <li>✗ No outdoor activities</li>
                <li>! Use air purifiers</li>
                <li>! Seek medical help if experiencing symptoms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Climate Tips */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">💡 Quick Climate Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-semibold mb-2">Monitor Daily AQI</p>
              <p className="text-sm opacity-90">Check air quality before planning outdoor activities</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-semibold mb-2">Stay Hydrated</p>
              <p className="text-sm opacity-90">Drink plenty of water, especially on hot days</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-semibold mb-2">Plan Smartly</p>
              <p className="text-sm opacity-90">Schedule outdoor activities during better air quality hours</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-semibold mb-2">Spread Awareness</p>
              <p className="text-sm opacity-90">Share environmental knowledge with family and friends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
