import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { productService, type Product as ApiProduct } from '../services/productService';
import { useCart } from '../context/useCart';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Plus,
  Minus,
  ZoomIn,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageCircle
} from 'lucide-react';

interface Product extends ApiProduct {
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  brand: string;
  specifications: { [key: string]: string };
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  userAvatar?: string;
}

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiProduct = await productService.getProductById(id);
        
        // Mapear os dados da API para o formato do componente
        const productData: Product = {
          ...apiProduct,
          originalPrice: undefined, // Pode adicionar lógica para preço original se necessário
          images: [
            '/assets/gamer/MouseGamer.jpg', // Imagem padrão baseada no produto
            '/assets/gamer/Tecladorazergamer.jpg',
            '/assets/gamer/CAdeiraGamer.jpg',
            '/assets/gamer/fonehxgamer.jpg'
          ],
          rating: 4.5, // Valor padrão - pode ser implementado no backend
          reviewCount: 89, // Valor padrão - pode ser implementado no backend
          inStock: apiProduct.stock > 0,
          brand: 'Logitech', // Pode ser extraído do nome ou adicionado no backend
          specifications: {
            'DPI': '5000',
            'Conectividade': 'USB',
            'Marca': 'Logitech',
            'Garantia': '2 anos',
            'Compatibilidade': 'Windows, Mac, Linux'
          }
        };

        setProduct(productData);

        // Reviews mockados - pode ser implementado no backend
        setReviews([
          {
            id: '1',
            userName: 'João Silva',
            rating: 5,
            comment: 'Excelente mouse! Muito preciso e confortável para jogos.',
            date: '2024-12-15',
            helpful: 23
          },
          {
            id: '2',
            userName: 'Maria Santos',
            rating: 4,
            comment: 'Boa qualidade, mas poderia ter mais botões programáveis.',
            date: '2024-12-10',
            helpful: 15
          },
          {
            id: '3',
            userName: 'Pedro Costa',
            rating: 5,
            comment: 'Melhor mouse que já usei! Vale cada centavo.',
            date: '2024-12-08',
            helpful: 31
          }
        ]);

      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      quantity: quantity,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Adicionar produto ao carrinho antes de redirecionar
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      quantity: quantity,
    });
    
    console.log(`${quantity} unidade(s) de ${product.name} adicionada(s) ao carrinho! Redirecionando para checkout...`);
    
    // Redirecionar para o carrinho
    navigate('/carrinho');
  };

  const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : i < rating
                ? 'text-yellow-400 fill-yellow-400/50'
                : 'text-slate-400'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#182337' }}>
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (!product) {
    return (      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#182337' }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Produto não encontrado</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Voltar à Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 pt-12" style={{ backgroundColor: '#182337' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <button onClick={() => navigate('/')} className="hover:text-purple-400 transition-colors">
                Home
              </button>
              <span>/</span>
              <button onClick={() => navigate('/products')} className="hover:text-purple-400 transition-colors">
                Produtos
              </button>
              <span>/</span>
              <span className="text-purple-400">{product.name}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galeria de Imagens */}
            <div className="space-y-4">
              {/* Imagem Principal */}
              <div className="relative bg-slate-800/50 rounded-2xl overflow-hidden group">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className={`w-full h-96 object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute top-4 right-4 bg-slate-900/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn size={20} />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-purple-500'
                        : 'border-slate-700 hover:border-purple-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Título e Avaliação */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-slate-300">({product.reviewCount} avaliações)</span>
                  </div>
                  <span className="text-purple-400 font-medium">{product.brand}</span>
                  {product.category && (
                    <span className="text-slate-400">• {product.category.name}</span>
                  )}
                </div>
              </div>

              {/* Preço */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-purple-400">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-slate-500 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <div className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm px-3 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Status do Estoque */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                  {product.inStock ? 'Em estoque' : 'Fora de estoque'}
                </span>
              </div>

              {/* Quantidade */}
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">Quantidade:</span>
                <div className="flex items-center border border-slate-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-700 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className="text-white" />
                  </button>
                  <span className="px-4 py-2 text-white bg-slate-800 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-slate-700 transition-colors"
                  >
                    <Plus size={16} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <ShoppingCart size={20} />
                    Adicionar ao Carrinho
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
                  >
                    <CreditCard size={20} />
                    Comprar Agora
                  </button>
                </div>

                {/* Ações Secundárias */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors">
                    <Heart size={20} />
                    Favoritar
                  </button>
                  <button className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors">
                    <Share2 size={20} />
                    Compartilhar
                  </button>
                </div>
              </div>

              {/* Garantias e Benefícios */}
              <div className="space-y-3 pt-6 border-t border-slate-700">
                <div className="flex items-center gap-3 text-slate-300">
                  <Truck size={20} className="text-purple-400" />
                  <span>Frete grátis para todo o Brasil</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Shield size={20} className="text-purple-400" />
                  <span>Garantia de 2 anos</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <RotateCcw size={20} className="text-purple-400" />
                  <span>30 dias para devolução</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de Informações */}
          <div className="mt-16">
            <div className="border-b border-slate-700">
              <nav className="flex space-x-8">
                {[
                  { id: 'description', label: 'Descrição' },
                  { id: 'specifications', label: 'Especificações' },
                  { id: 'reviews', label: `Avaliações (${product.reviewCount})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {/* Descrição */}
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-6 space-y-4">
                    <h3 className="text-xl font-semibold text-white">Características Principais:</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Switches mecânicos Cherry MX Blue para máxima precisão</li>
                      <li>• Iluminação RGB com 16.7 milhões de cores</li>
                      <li>• Design ergonômico para longas sessões de jogo</li>
                      <li>• Teclas com anti-ghosting para comandos simultâneos</li>
                      <li>• Software dedicado para personalização completa</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Especificações */}
              {activeTab === 'specifications' && (
                <div className="bg-slate-800/30 rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0">
                        <span className="font-medium text-slate-300">{key}:</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Avaliações */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">                
                  <div className="bg-slate-800/30 rounded-2xl p-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">
                          {product.rating.toFixed(1)}
                        </div>
                        <StarRating rating={product.rating} size={20} />
                        <div className="text-sm text-slate-400 mt-1">
                          {product.reviewCount} avaliações
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm text-slate-400 w-8">{stars}★</span>
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${Math.random() * 100}%` // Em produção alterar para o preço real do bagulho
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-400 w-12">
                              {Math.floor(Math.random() * 50)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lista de Avaliações */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-slate-800/30 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium text-white">{review.userName}</span>
                              <StarRating rating={review.rating} />
                              <span className="text-sm text-slate-400">
                                {new Date(review.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-slate-300 mb-4">{review.comment}</p>
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors">
                                <ThumbsUp size={16} />
                                <span>Útil ({review.helpful})</span>
                              </button>
                              <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
                                <ThumbsDown size={16} />
                                <span>Não útil</span>
                              </button>
                              <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
                                <MessageCircle size={16} />
                                <span>Responder</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botão para Escrever Avaliação */}
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg transition-all">
                      Escrever Avaliação
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      
      <Footer />
    </div>
  );
};

export default Product;
