import { Download, Edit, Trash2, Search, Filter } from "lucide-react";
import { type User } from "../../services/userService";
import React from "react";
import { Link } from "react-router-dom";

interface UsersSectionProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onDeleteUser: (id: string) => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({
  users,
  loading,
  error,
  onDeleteUser,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">Gestão de Usuários</h2>
      <div className="flex space-x-2">
        <Link to="/reports" className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-purple-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
          <Download size={20} />
          <span>Exportar</span>
        </Link>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[
        {
          label: "Total de Usuários",
          value: users.length.toString(),
          color: "purple",
        },
        {
          label: "Usuários Ativos",
          value: users.filter((u) => u.role === "CUSTOMER").length.toString(),
          color: "green",
        },
        {
          label: "Administradores",
          value: users.filter((u) => u.role === "ADMIN").length.toString(),
          color: "purple",
        },
        { label: "Novos (30 dias)", value: "0", color: "blue" },
      ].map((stat, index) => (
        <div
          key={index}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50 shadow-2xl"
        >
          <h3 className="text-sm font-medium text-slate-400 mb-1">{stat.label}</h3>
          <p
            className={`text-2xl font-bold ${
              stat.color === "purple"
                ? "text-purple-400"
                : stat.color === "green"
                ? "text-green-400"
                : "text-blue-400"
            }`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
    {error && (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )}
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          />
        </div>
        <button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-purple-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
          <Filter size={20} />
          <span>Filtros</span>
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-left p-4 font-semibold text-slate-300">Nome</th>
                <th className="text-left p-4 font-semibold text-slate-300">Email</th>
                <th className="text-left p-4 font-semibold text-slate-300">Tipo</th>
                <th className="text-left p-4 font-semibold text-slate-300">Criado em</th>
                <th className="text-left p-4 font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4 font-medium text-white">{user.name}</td>
                  <td className="p-4 text-slate-300">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-400/20 text-purple-400 border border-purple-400/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Administrador" : "Cliente"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default UsersSection;
