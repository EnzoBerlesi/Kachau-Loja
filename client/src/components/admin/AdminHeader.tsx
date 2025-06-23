import { Sparkles, Settings } from 'lucide-react';

const AdminHeader = () => (
  <div className="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
          </div>
          <p className="text-slate-400">Gerecimento da Kachau</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-slate-400 hover:text-white transition-colors">
            <Settings size={24} />
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminHeader;
