interface AQIGaugeProps {
  aqi: number;
  category: string;
  color: string;
}

export default function AQIGauge({ aqi, category, color }: AQIGaugeProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-48 h-48 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: color }}
      >
        <div className="text-center">
          <div className="text-6xl font-bold" style={{ color: aqi > 100 ? 'white' : 'black' }}>
            {aqi}
          </div>
          <div className="text-lg font-medium" style={{ color: aqi > 100 ? 'white' : 'black' }}>
            AQI
          </div>
        </div>
      </div>
      <div className="mt-4 text-xl font-semibold">{category}</div>
    </div>
  );
}
