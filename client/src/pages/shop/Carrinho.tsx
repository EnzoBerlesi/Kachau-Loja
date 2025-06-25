import { useState } from "react";
import { Header, Footer } from "../../components/layout";
import { useCart } from "../../context/useCart";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Carrinho() {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const navigate = useNavigate();

  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);

  const aplicarCupom = () => {
    if (cupom.toLowerCase() === "kachau10") {
      setDesconto(0.1);
    } else {
      alert("Cupom inválido.");
      setDesconto(0);
    }
  };

  const calcularFrete = () => {
    if (cep.length === 8) {
      setFrete(29.9); // valor fictício
    } else {
      alert("CEP inválido. Digite 8 números.");
      setFrete(null);
    }
  };

  const subtotal = cart.reduce((acc: number, item: { price: number; quantity: number; }) => acc + item.price * item.quantity, 0);
  const total = subtotal * (1 - desconto) + (frete || 0);

  const finalizarCompra = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Você precisa estar logado para finalizar a compra.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/checkout",
        {
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      clearCart();
      navigate("/order-confirmation", { state: response.data });
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
        <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center mt-8">
          Seu Carrinho
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-400 text-center">Seu carrinho está vazio.</p>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto animate-fadeIn">
            <ul>
              {cart.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between border-b border-gray-700 py-4 mb-4 transition-all duration-300 hover:bg-gray-700/20 rounded"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://via.placeholder.com/80?text=${item.name}`}
                      alt={item.name}
                      className="w-16 h-16 rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="text-sm text-gray-400">Qtd:</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            addToCart({ ...item, quantity: parseInt(e.target.value) - item.quantity })
                          }
                          className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-purple-300 font-bold">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
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
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold transition-all duration-200 hover:scale-105"
              >
                Aplicar Cupom
              </button>
            </div>

            {/* Frete */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <button
                onClick={calcularFrete}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition-all duration-200 hover:scale-105"
              >
                Calcular Frete
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
              {frete && (
                <p className="text-blue-400">Frete: R$ {frete.toFixed(2)}</p>
              )}
              <p className="font-bold text-purple-400 text-xl">
                Total: R$ {total.toFixed(2)}
              </p>
            </div>

            <button
              onClick={finalizarCompra}
              className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Carrinho;
