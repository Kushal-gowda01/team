'use client';

import { getAQICategory, getAQIColor } from '@/lib/aqi-utils';
import { getHealthImpact, getRecommendation } from '@/lib/health-utils';

interface AQIDisplayProps {
  aqi: number;
  dominantPollutant: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  city: string;
  timestamp: string;
  pollutants?: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
}

export default function AQIDisplay({
  aqi,
  dominantPollutant,
  temperature,
  humidity,
  pressure,
  city,
  timestamp,
  pollutants,
}: AQIDisplayProps) {
  const category = getAQICategory(aqi);
  const color = getAQIColor(aqi);
  const healthImpact = {
    impact: getHealthImpact(aqi, category.category),
    sensitiveGroups: [
      'Children and elderly',
      'People with respiratory diseases',
      'People with heart disease',
      'Pregnant women',
    ],
  };
  const recommendation = {
    actions: getRecommendation(aqi, category.category).split('. ').filter(Boolean),
  };

  return (
    <div className="space-y-6">
      {/* Header with City and Timestamp */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{city}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main AQI Display */}
      <div
        style={{ backgroundColor: `#${category.color}` }}
        className={`rounded-xl shadow-lg p-8`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-lg opacity-90 mb-2 ${category.textColor === '#000000' ? 'text-black' : 'text-black'}`}>
              Air Quality Index
            </p>
            <div className="flex items-baseline gap-4">
              <div className={`text-6xl font-bold ${category.textColor === '#000000' ? 'text-black' : 'text-black'}`}>
                {aqi}
              </div>
              <div>
                <p className={`text-2xl font-semibold ${category.textColor === '#000000' ? 'text-black' : 'text-black'}`}>
                  {category.label}
                </p>
                <p className={`text-sm ${category.textColor === '#000000' ? 'text-black opacity-70' : 'text-black opacity-75'}`}>
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Impact */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>❤️</span> Health Impact
          </h3>
          <p className="text-gray-700 mb-4">{healthImpact.impact}</p>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-600">Sensitive Groups:</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              {healthImpact.sensitiveGroups.map((group, idx) => (
                <li key={idx}>{group}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>💡</span> Recommendations
          </h3>
          <ul className="space-y-2">
            {recommendation.actions.map((action, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Environmental Conditions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {temperature !== undefined && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🌡️</div>
              <div className="text-sm text-gray-600">Temperature</div>
              <div className="text-xl font-bold">{temperature.toFixed(1)}°C</div>
            </div>
          )}
          {humidity !== undefined && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">💧</div>
              <div className="text-sm text-gray-600">Humidity</div>
              <div className="text-xl font-bold">{humidity.toFixed(0)}%</div>
            </div>
          )}
          {pressure !== undefined && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm text-gray-600">Pressure</div>
              <div className="text-xl font-bold">{pressure.toFixed(0)} hPa</div>
            </div>
          )}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">💨</div>
            <div className="text-sm text-gray-600">Dominant Pollutant</div>
            <div className="text-xl font-bold uppercase">{dominantPollutant}</div>
          </div>
        </div>
      </div>

      {/* Pollutants Breakdown */}
      {pollutants && Object.values(pollutants).some(v => v !== undefined) && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Pollutant Levels (μg/m³)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pollutants.pm25 !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-600">PM2.5</div>
                <div className="text-lg font-bold text-gray-900">
                  {pollutants.pm25.toFixed(1)}
                </div>
              </div>
            )}
            {pollutants.pm10 !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-600">PM10</div>
                <div className="text-lg font-bold text-gray-900">
                  {pollutants.pm10.toFixed(1)}
                </div>
              </div>
            )}
            {pollutants.o3 !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-600">O3</div>
                <div className="text-lg font-bold text-gray-900">
                  {pollutants.o3.toFixed(1)}
                </div>
              </div>
            )}
            {pollutants.no2 !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-600">NO2</div>
                <div className="text-lg font-bold text-gray-900">
                  {pollutants.no2.toFixed(1)}
                </div>
              </div>
            )}
            {pollutants.so2 !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-600">SO2</div>
                <div className="text-lg font-bold text-gray-900">
                  {pollutants.so2.toFixed(1)}
                </div>
              </div>
            )}
            {pollutants.co !== undefined && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-600">CO</div>
                <div className="text-lg font-bold text-gray-900">
                  {pollutants.co.toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
