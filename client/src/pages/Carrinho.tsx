import  { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/footer";

function Carrinho() {
  const [carrinho, setCarrinho] = useState([
    {
      id: 1,
      nome: "Mouse Gamer RGB",
      preco: 199.99,
      quantidade: 1,
      imagem: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      nome: "Teclado Mecânico 65%",
      preco: 349.9,
      quantidade: 2,
      imagem: "https://via.placeholder.com/80",
    },
  ]);

  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);

  const aplicarCupom = () => {
    if (cupom.toLowerCase() === "kachau10") {
      setDesconto(0.1); // 10%
    } else {
      alert("Cupom inválido.");
      setDesconto(0);
    }
  };

  const atualizarQuantidade = (id: number, novaQtd: number) => {
    setCarrinho((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: novaQtd } : item
      )
    );
  };

  const removerItem = (id: number) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  const total = subtotal - subtotal * desconto;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">
          Seu Carrinho
        </h1>

        {carrinho.length === 0 ? (
          <p className="text-gray-400">Seu carrinho está vazio.</p>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <ul>
              {carrinho.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-700 py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.nome}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="text-sm text-gray-400">Qtd:</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantidade}
                          onChange={(e) =>
                            atualizarQuantidade(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-purple-300 font-bold">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removerItem(item.id)}
                      className="text-sm text-red-400 hover:underline mt-1"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Cupom */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Digite seu cupom"
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <button
                onClick={aplicarCupom}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold transition"
              >
                Aplicar Cupom
              </button>
            </div>

            {/* Totais */}
            <div className="mt-6 border-t border-gray-700 pt-4 text-right text-lg">
              <p className="text-gray-300">
                Subtotal: R$ {subtotal.toFixed(2)}
              </p>
              {desconto > 0 && (
                <p className="text-green-400">
                  Desconto: -{(desconto * 100).toFixed(0)}%
                </p>
              )}
              <p className="font-bold text-purple-400 text-xl">
                Total: R$ {total.toFixed(2)}
              </p>
            </div>

            <button className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold transition">
              Finalizar Compra
            </button>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default Carrinho;
