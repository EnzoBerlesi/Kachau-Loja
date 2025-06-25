import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { getProductImage } from '../../services/imageService';
import type { Product } from '../../services/productService';
import type { Category } from '../../services/categoryService';

// Mapeamento de slugs de URL para IDs de categoria (memoizado)
const CATEGORY_MAP: Record<string, { name: string, icon: string }> = {
  'gamer': { name: 'Gamer', icon: '🎮' },
  'escritorio': { name: 'Escritório', icon: '💼' },
  'perifericos': { name: 'Periféricos', icon: '🖱️' },
  'notebooks': { name: 'Notebooks', icon: '💻' },
  'hardware': { name: 'Hardware', icon: '⚙️' }
};

// Componente de Loading otimizado
const LoadingSpinner = () => (
  <div className="flex justify-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 border-r-2"></div>
  </div>
);

// Componente de Error otimizado
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-900/30 border border-red-800/50 text-red-300 p-6 rounded-lg text-center">
    {message}
  </div>
);

// Componente de Header da categoria otimizado
const CategoryHeader = ({ 
  categoryInfo, 
  productCount 
}: { 
  categoryInfo: { name: string, icon: string }, 
  productCount: number 
}) => (
  <div className="flex items-center mb-8">
    <span className="text-3xl mr-3">{categoryInfo.icon}</span>
    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
      {categoryInfo.name}
    </h1>
    <span className="ml-4 text-sm text-gray-400">({productCount} produtos)</span>
  </div>
);

// Componente de produto otimizado para esta página
const CategoryProductCard = ({ 
  product, 
  categoryId 
}: { 
  product: Product, 
  categoryId: string | number 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] block"
    >
      <img
        src={getProductImage(String(product.id), String(categoryId))}
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors text-lg">
          {product.name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mt-1">{product.description}</p>
        <div className="mt-3">
          <span className="text-purple-400 font-bold text-lg">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
            {product.stock > 0 ? `${product.stock} em estoque` : 'Indisponível'}  
          </span>
          <span className="bg-purple-700 text-white text-xs rounded-full px-3 py-1">
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
};

function CategoryPageOptimized() {
  const location = useLocation();
  // Extrair o slug da URL
  const slug = location.pathname.substring(1); // Remove a / inicial
  
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Título e ícone da categoria baseados no slug da URL (memoizado)
  const categoryInfo = useMemo(() => {
    return slug && CATEGORY_MAP[slug] 
      ? CATEGORY_MAP[slug] 
      : { name: 'Produtos', icon: '🛒' };
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Primeiro tentamos buscar a categoria pelo nome para obter o ID
        const categories = await categoryService.getAllCategories();
        const matchedCategory = categories.find(
          cat => cat.name.toLowerCase() === categoryInfo.name.toLowerCase()
        );
        
        if (matchedCategory) {
          setActiveCategory(matchedCategory);
          
          // Buscamos os produtos dessa categoria
          const categoryProducts = await productService.getProductsByCategory(matchedCategory.id);
          setProducts(categoryProducts);
        } else {
          // Se não encontrou categoria correspondente, mostra mensagem
          setError(`Categoria ${categoryInfo.name} não encontrada`);
        }
      } catch (err) {
        console.error(`Erro ao buscar produtos da categoria ${slug}:`, err);
        setError(`Erro ao carregar produtos da categoria ${categoryInfo.name}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, categoryInfo.name]);

  return (
    <>
      <Header />
      <div className="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-12 pb-8 min-h-screen">
        <div className="container mx-auto px-4 pt-8">
          <CategoryHeader 
            categoryInfo={categoryInfo} 
            productCount={products.length} 
          />

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : products.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-700/30 text-center">
              <h3 className="text-xl text-purple-300 mb-4">Nenhum produto encontrado</h3>
              <p className="text-slate-400">
                No momento não temos produtos disponíveis nesta categoria.
              </p>
              <Link to="/" className="inline-block mt-6 px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition">
                Voltar para Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  categoryId={activeCategory?.id || '0'}
                />
              ))}
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </>
  );
}

export default CategoryPageOptimized;
