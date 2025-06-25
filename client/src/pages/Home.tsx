import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/ui/Carousel";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { productService } from "../services/productService";
import type { Product } from "../services/productService";
import { getProductImage } from "../services/imageService";
import { useCart } from "../context/useCart";

// COMPONENTE PRINCIPAL (HOME)
function Home() {
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Busca todos os produtos
        const allProducts = await productService.getAllProducts();

        if (allProducts.length === 0) {
          setError("Nenhum produto encontrado");
          return;
        }

        // Seleciona alguns produtos para promoções (primeiros 4 ou todos se < 4)
        const promos = allProducts.slice(0, Math.min(4, allProducts.length));

        // Seleciona produtos diferentes para novidades (próximos 4 ou restantes se < 4)
        const newest = allProducts.slice(
          Math.min(4, allProducts.length),
          Math.min(8, allProducts.length)
        );

        // Se não tiver produtos suficientes para a seção de novidades, usa alguns das promoções
        if (newest.length === 0 && promos.length > 0) {
          setNewProducts(promos);
        } else {
          setNewProducts(newest);
        }

        setPromotionProducts(promos);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao carregar produtos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Função para calcular preço com desconto (simulando promoções)
  const calculateDiscountedPrice = (price: number) => {
    const discount = 0.15; // 15% de desconto para promoções
    return (price * (1 - discount)).toFixed(2);
  };

  // Formatar preço em reais
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-12 pb-8">
        {/* Carrossel no topo */}
        <Carousel />

        {/* Seção de Promoções */}
        <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl mx-4 mt-8 border border-slate-700/30">
          <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <span className="text-purple-300">🔥</span> PROMOÇÕES
          </h2>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 border-r-2"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-400">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {" "}
              {promotionProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] block"
                >
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/vite.svg'; // Fallback visual
                      e.currentTarget.alt = 'Imagem não disponível';
                    }}
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-purple-400 font-bold">
                        {formatPrice(
                          parseFloat(calculateDiscountedPrice(product.price))
                        )}
                      </span>
                      <span className="text-slate-500 text-sm line-through ml-2">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          categoryId: product.categoryId,
                          quantity: 1,
                        });
                      }}
                      className="mt-2 w-full text-sm bg-purple-700 hover:bg-purple-800 text-white py-1 px-3 rounded transition"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Seção de Novos Produtos */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl mx-4 mt-12 border border-slate-700/20">
          <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <span className="text-purple-200">🆕</span> NOVIDADES
          </h2>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 border-r-2"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-400">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {" "}
              {newProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-400/30 transition-all duration-300 transform hover:scale-[1.02] block"
                >
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/vite.svg'; // Fallback visual
                      e.currentTarget.alt = 'Imagem não disponível';
                    }}
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-purple-300 font-bold mt-1">
                      {formatPrice(product.price)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          categoryId: product.categoryId,
                          quantity: 1,
                        });
                      }}
                      className="mt-2 w-full text-sm bg-purple-700 hover:bg-purple-800 text-white py-1 px-3 rounded transition"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
