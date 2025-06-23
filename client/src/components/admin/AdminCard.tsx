import React from 'react';

interface AdminCardProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  sectionKey: string;
  count?: number;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminCard: React.FC<AdminCardProps> = ({
  icon: Icon,
  title,
  description,
  sectionKey,
  count,
  activeSection,
  setActiveSection,
}) => (
  <div
    className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl border ${
      activeSection === sectionKey
        ? 'border-purple-400 bg-gradient-to-br from-purple-400/15 to-purple-400/10'
        : 'border-slate-700/50 hover:border-purple-400/50'
    } transform hover:scale-[1.02]`}
    onClick={() => setActiveSection(sectionKey)}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div
          className={`p-3 rounded-lg transition-all duration-300 ${
            activeSection === sectionKey
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
              : 'bg-slate-700/50 text-purple-400 hover:bg-purple-400/20'
          }`}
        >
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      {count !== undefined && (
        <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  </div>
);

export default AdminCard;