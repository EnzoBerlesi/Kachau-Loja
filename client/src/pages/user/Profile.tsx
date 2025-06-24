import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    nome: "Manoel Gomes",
    email: "manel@example.com",
    cpf: "111.222.333-45",
    endereco: "Rua das Violetas, 123 - São Paulo, SP",
  });

  const [editando, setEditando] = useState(false);

  const [pedidos] = useState([
    {
      id: "001",
      produto: "Teclado Mecânico 65%",
      data: "20/06/2025",
      status: "Entregue",
      total: 349.9,
    },
    {
      id: "002",
      produto: "Mouse Gamer RGB",
      data: "10/06/2025",
      status: "Enviado",
      total: 199.99,
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-purple-400 mb-4">Perfil</h1>

          {/* Dados do Usuário */}
          <div className="space-y-4">
            {editando ? (
              <>
                <div>
                  <label className="block text-sm text-gray-300">Nome:</label>
                  <input
                    type="text"
                    name="nome"
                    value={user.nome}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded bg-gray-700 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">E-mail:</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded bg-gray-700 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">CPF:</label>
                  <input
                    type="text"
                    name="cpf"
                    value={user.cpf}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded bg-gray-700 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Endereço:</label>
                  <input
                    type="text"
                    name="endereco"
                    value={user.endereco}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded bg-gray-700 text-white border border-gray-600"
                  />
                </div>
                <button
                  onClick={() => setEditando(false)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                  Salvar Alterações
                </button>
              </>
            ) : (
              <>
                <p><span className="text-purple-400">Nome:</span> {user.nome}</p>
                <p><span className="text-purple-400">E-mail:</span> {user.email}</p>
                <p><span className="text-purple-400">CPF:</span> {user.cpf}</p>
                <p><span className="text-purple-400">Endereço:</span> {user.endereco}</p>
                <button
                  onClick={() => setEditando(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                  Editar Perfil
                </button>
              </>
            )}
          </div>

          {/* Histórico de Pedidos */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">Histórico de Pedidos</h2>
            {pedidos.length === 0 ? (
              <p className="text-gray-400">Nenhum pedido encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-gray-700">
                  <thead className="text-xs text-purple-300 uppercase bg-gray-700">
                    <tr>
                      <th className="px-4 py-2">Pedido</th>
                      <th className="px-4 py-2">Produto</th>
                      <th className="px-4 py-2">Data</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id} className="bg-gray-800 border-t border-gray-700">
                        <td className="px-4 py-2">#{pedido.id}</td>
                        <td className="px-4 py-2">{pedido.produto}</td>
                        <td className="px-4 py-2">{pedido.data}</td>
                        <td className="px-4 py-2">{pedido.status}</td>
                        <td className="px-4 py-2 text-purple-400 font-bold">R$ {pedido.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
