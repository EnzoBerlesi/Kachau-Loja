import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { getProductImage, getKitImages, isKit } from '../services/imageService';
import { useCart } from '../context/useCart';
import type { Product } from '../services/productService';
import type { Category } from '../services/categoryService';

function Products() {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obter parâmetros da URL
  const categoryName = searchParams.get('categoryName');
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar categorias
        const allCategories = await categoryService.getAllCategories();
        setCategories(allCategories);

        // Buscar produtos baseado nos parâmetros da URL
        let fetchedProducts: Product[] = [];
        let matchedCategory: Category | null = null;

        if (categoryName) {
          // Buscar por nome da categoria
          fetchedProducts = await productService.getProductsByCategoryName(categoryName);
          matchedCategory = allCategories.find(
            cat => cat.name.toLowerCase() === categoryName.toLowerCase()
          ) || null;
        } else if (categoryId) {
          // Buscar por ID da categoria
          fetchedProducts = await productService.getProductsByCategory(categoryId);
          matchedCategory = allCategories.find(cat => cat.id === categoryId) || null;
        } else {
          // Buscar todos os produtos se não há filtro
          fetchedProducts = await productService.getAllProducts();
        }

        setProducts(fetchedProducts);
        setActiveCategory(matchedCategory);

      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao carregar produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName, categoryId]);

  // Formatar preço em reais
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Título da página baseado nos filtros
  const getPageTitle = () => {
    if (activeCategory) {
      return activeCategory.name;
    }
    if (categoryName) {
      return categoryName;
    }
    return 'Todos os Produtos';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-12 pb-8">
        <div className="container mx-auto px-4 pt-8">
          
          {/* Filtro por Categorias */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Filtrar por Categoria</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/products"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !categoryName && !categoryId
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Todos
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?categoryName=${encodeURIComponent(category.name)}`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    categoryName === category.name || categoryId === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Título e contador */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {getPageTitle()}
            </h1>
            <span className="text-sm text-gray-400">
              {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 border-r-2"></div>
            </div>
          ) : error ? (
            /* Error */
            <div className="bg-red-900/30 border border-red-800/50 text-red-300 p-6 rounded-lg text-center">
              {error}
            </div>
          ) : products.length === 0 ? (
            /* Empty state */
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-700/30 text-center">
              <h3 className="text-xl text-purple-300 mb-4">Nenhum produto encontrado</h3>
              <p className="text-slate-400 mb-6">
                {categoryName || categoryId 
                  ? `Não encontramos produtos na categoria ${getPageTitle()}.`
                  : 'No momento não temos produtos disponíveis.'
                }
              </p>
              <Link 
                to="/products" 
                className="inline-block px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition"
              >
                Ver Todos os Produtos
              </Link>
            </div>
          ) : (
            /* Products grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <div
                  key={product.id}
                  className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Link to={`/product/${product.id}`}>
                    {/* Verificar se é kit para mostrar múltiplas imagens */}
                    {isKit(product.name) ? (
                      <div className="relative h-48 overflow-hidden">
                        {getKitImages(product.name).slice(0, 2).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${product.name} - Item ${index + 1}`}
                            className={`absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                              index === 0 ? 'z-10 clip-path-half-left' : 'z-5 clip-path-half-right'
                            }`}
                            style={{
                              clipPath: index === 0 ? 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' : 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'
                            }}
                          />
                        ))}
                        {/* Badge indicando que é um kit */}
                        <div className="absolute top-2 left-2 bg-purple-600/90 text-white text-xs px-2 py-1 rounded-full z-20">
                          Kit
                        </div>
                      </div>
                    ) : (
                      <img
                        src={getProductImage(product.id)}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
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
                  
                  {/* Botão Adicionar ao Carrinho */}
                  <div className="p-4 pt-0">
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
                      disabled={product.stock <= 0}
                      className="w-full mt-2 text-sm bg-purple-700 hover:bg-purple-800 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-3 rounded transition"
                    >
                      {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Products;
