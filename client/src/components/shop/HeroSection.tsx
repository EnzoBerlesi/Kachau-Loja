import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface HeroSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  icon: Icon,
  title,
  description,
  iconColor = "text-red-500",
  gradientFrom = "from-red-500",
  gradientTo = "to-purple-500"
}) => {
  return (
    <div className="pt-28 pb-16 px-4 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Icon className={iconColor} size={32} />
        <h1 className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>
          {title}
        </h1>
      </div>
      <p className="text-gray-300 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default HeroSection;
