interface AQICategoryBadgeProps {
  category: string;
  color: string;
}

export default function AQICategoryBadge({ category, color }: AQICategoryBadgeProps) {
  const textColor = ['good', 'moderate'].includes(category.toLowerCase()) ? 'text-black' : 'text-white';
  
  return (
    <span
      className={`inline-block px-4 py-2 rounded-full font-semibold ${textColor}`}
      style={{ backgroundColor: color }}
    >
      {category}
    </span>
  );
}
