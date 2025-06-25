import React from 'react';
import { TrendingUp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendasHeader: React.FC = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700/50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Sistema de Vendas
              </h1>
              <p className="text-gray-300 text-sm">
                Gerencie vendas e clientes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200 text-gray-300 hover:text-white"
            >
              <Home className="h-4 w-4" />
              <span>Voltar ao Início</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendasHeader;
