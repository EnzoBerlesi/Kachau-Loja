import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    endereco: "",
  });

  useEffect(() => {
    console.log("User data:", user);
    if (user) {
      setFormData({
        nome: user.name || "",
        email: user.email,
        endereco: user.endereco || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-purple-400 mb-4">Perfil</h1>

          <div className="space-y-4">
            {editando ? (
              <>
                {["nome", "email", "cpf", "endereco"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-300">
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      className="w-full p-2 mt-1 rounded bg-gray-700 text-white border border-gray-600"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setEditando(false)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                  Salvar Alterações
                </button>
              </>
            ) : (
              <>
                <p>
                  <span className="text-purple-400">Nome:</span> {formData.nome}
                </p>
                <p>
                  <span className="text-purple-400">E-mail:</span>{" "}
                  {formData.email}
                </p>
                <p>
                  <span className="text-purple-400">Endereço:</span>{" "}
                  {formData.endereco}
                </p>
                <button
                  onClick={() => setEditando(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                  Editar Perfil
                </button>
              </>
            )}
          </div>

          {/* Histórico de pedidos (como já está) */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
              Histórico de Pedidos
            </h2>
            {/* ...tabela de pedidos... */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
