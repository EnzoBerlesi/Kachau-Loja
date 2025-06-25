import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Header, Footer } from "../../components/layout";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.order;

  useEffect(() => {
    if (!orderData) {
      navigate("/", { replace: true }); 
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-xl w-full text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-4">
            🎉 Pedido Confirmado!
          </h1>
          <p className="text-lg text-gray-300 mb-2">
            Obrigado por comprar com a <span className="text-purple-400 font-semibold">Kachau Loja</span>!
          </p>
          <div className="mt-6 text-left">
            <p><span className="font-semibold text-purple-300">Código do Pedido:</span> {orderData.id}</p>
            <p><span className="font-semibold text-purple-300">Status:</span> {orderData.status}</p>
            <p><span className="font-semibold text-purple-300">Total:</span> R$ {orderData.total.toFixed(2)}</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderConfirmation;
