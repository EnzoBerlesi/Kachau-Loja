import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface VendasCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  sectionKey: string;
  count?: number;
  activeSection: string;
  setActiveSection: (section: string) => void;
  color?: 'green' | 'blue' | 'purple' | 'orange';
}

const VendasCard: React.FC<VendasCardProps> = ({
  icon: Icon,
  title,
  description,
  sectionKey,
  count,
  activeSection,
  setActiveSection,
  color = 'green'
}) => {
  const isActive = activeSection === sectionKey;
  
  const colorClasses = {
    green: {
      gradient: 'from-green-500 to-emerald-600',
      border: 'border-green-500/50',
      bg: 'bg-green-500/10',
      text: 'text-green-400'
    },
    blue: {
      gradient: 'from-blue-500 to-cyan-600',
      border: 'border-blue-500/50',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400'
    },
    purple: {
      gradient: 'from-purple-500 to-violet-600',
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400'
    },
    orange: {
      gradient: 'from-orange-500 to-amber-600',
      border: 'border-orange-500/50',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400'
    }
  };

  const colors = colorClasses[color];

  return (
    <div
      onClick={() => setActiveSection(sectionKey)}
      className={`
        relative p-6 rounded-2xl border backdrop-blur-sm cursor-pointer
        transition-all duration-300 group overflow-hidden
        ${isActive 
          ? `${colors.border} ${colors.bg} shadow-lg transform scale-105` 
          : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50 hover:bg-gray-700/30'
        }
      `}
    >
      {/* Background gradient effect */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
        bg-gradient-to-br ${colors.gradient}
      `} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-3 rounded-xl shadow-lg
            ${isActive 
              ? `bg-gradient-to-br ${colors.gradient}` 
              : 'bg-gray-700/50 group-hover:bg-gray-600/50'
            }
          `}>
            <Icon className={`h-6 w-6 ${isActive ? 'text-white' : colors.text}`} />
          </div>
          
          {count !== undefined && (
            <div className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${isActive 
                ? `${colors.bg} ${colors.text} border ${colors.border}` 
                : 'bg-gray-700/50 text-gray-300'
              }
            `}>
              {count}
            </div>
          )}
        </div>

        <h3 className={`
          text-lg font-semibold mb-2 transition-colors duration-200
          ${isActive ? colors.text : 'text-white group-hover:text-gray-100'}
        `}>
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-200">
          {description}
        </p>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className={`
          absolute top-0 left-0 w-full h-1 
          bg-gradient-to-r ${colors.gradient}
        `} />
      )}
    </div>
  );
};

export default VendasCard;
