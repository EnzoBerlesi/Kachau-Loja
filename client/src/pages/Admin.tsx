import { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Truck, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Sparkles,
  Tag,
  Eye
} from 'lucide-react';
import { productService, type Product } from '../services/productService';
import { categoryService, type Category } from '../services/categoryService';
import { orderService, type Order } from '../services/orderService';
import { userService, type User } from '../services/userService';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('products');
  
  // Estados para dados
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch (activeSection) {
        case 'products': {
          const productsData = await productService.getAllProducts();
          setProducts(productsData);
          break;
        }
        case 'categories': {
          const categoriesData = await categoryService.getAllCategories();
          setCategories(categoriesData);
          break;
        }
        case 'orders': {
          const ordersData = await orderService.getAllOrders();
          setOrders(ordersData);
          break;
        }
        case 'users': {
          const usersData = await userService.getAllUsers();
          setUsers(usersData);
          break;
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  // Carrega dados quando a seção muda
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar produto';
      setError(errorMessage);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;
    
    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar categoria';
      setError(errorMessage);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar usuário';
      setError(errorMessage);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await orderService.updateOrderStatus(id, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do pedido';
      setError(errorMessage);
    }
  };

  const AdminCard = ({ 
    icon: Icon, 
    title, 
    description, 
    sectionKey, 
    count 
  }: {
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    description: string;
    sectionKey: string;
    count?: number;
  }) => (
    <div      className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl border ${
        activeSection === sectionKey 
          ? 'border-purple-400 bg-gradient-to-br from-purple-400/15 to-purple-400/10' 
          : 'border-slate-700/50 hover:border-purple-400/50'
      } transform hover:scale-[1.02]`}
      onClick={() => setActiveSection(sectionKey)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">          <div className={`p-3 rounded-lg transition-all duration-300 ${
            activeSection === sectionKey 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' 
              : 'bg-slate-700/50 text-purple-400 hover:bg-purple-400/20'
          }`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>
        {count !== undefined && (
          <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
    </div>
  );

  const ProductsSection = () => (
    <div className="space-y-6">      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciador de Produtos</h2>
        <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.02]">
          <Plus size={20} />
          <span>Adicionar Produto</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />            <input 
              type="text" 
              placeholder="Buscar produtos..." 
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
                  <th className="text-left p-4 font-semibold text-slate-300">Produto</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Descrição</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Preço</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Estoque</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Categoria</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium text-white">{product.name}</td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">{product.description}</td>
                    <td className="p-4 text-white font-semibold">R$ {product.price.toFixed(2)}</td>
                    <td className="p-4 text-slate-300">{product.stock}</td>
                    <td className="p-4 text-slate-300">{product.category?.name || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="text-purple-400 hover:text-purple-300 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Nenhum produto encontrado
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

  const CategoriesSection = () => (
    <div className="space-y-6">      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Categorias</h2>
        <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.02]">
          <Plus size={20} />
          <span>Adicionar Categoria</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <div key={category.id} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:border-purple-400/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-400/20 rounded-lg">
                      <Tag className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{category.description}</p>
              </div>
            ))}
            {categories.length === 0 && !loading && (
              <div className="col-span-full text-center text-slate-400 py-8">
                Nenhuma categoria encontrada
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const OrdersSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Pedidos</h2>
        <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.02]">
          <Download size={20} />
          <span>Exportar Relatório</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="text-left p-4 font-semibold text-slate-300">ID</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Cliente</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Total</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Data</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium text-white">#{order.id.slice(0, 8)}</td>
                    <td className="p-4 text-slate-300">{order.user?.name || 'N/A'}</td>
                    <td className="p-4 text-white font-semibold">R$ {order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="PENDING">Pendente</option>
                        <option value="PROCESSING">Processando</option>
                        <option value="SHIPPED">Enviado</option>
                        <option value="DELIVERED">Entregue</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </td>
                    <td className="p-4 text-slate-300">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Nenhum pedido encontrado
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

  const UsersSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestão de Usuários</h2>        <div className="flex space-x-2">
          <button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-purple-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
            <Download size={20} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total de Usuários', value: users.length.toString(), color: 'purple' },
          { label: 'Usuários Ativos', value: users.filter(u => u.role === 'CUSTOMER').length.toString(), color: 'green' },
          { label: 'Administradores', value: users.filter(u => u.role === 'ADMIN').length.toString(), color: 'purple' },
          { label: 'Novos (30 dias)', value: '0', color: 'blue' },
        ].map((stat, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50 shadow-2xl">
            <h3 className="text-sm font-medium text-slate-400 mb-1">{stat.label}</h3>            <p className={`text-2xl font-bold ${
              stat.color === 'purple' ? 'text-purple-400' :
              stat.color === 'green' ? 'text-green-400' :
              'text-blue-400'
            }`}>{stat.value}</p>
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />            <input 
              type="text" 
              placeholder="Buscar usuários..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"            />
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
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium text-white">{user.name}</td>
                    <td className="p-4 text-slate-300">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="text-purple-400 hover:text-purple-300 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
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

  const renderSection = () => {
    switch (activeSection) {
      case 'products':
        return <ProductsSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'orders':
        return <OrdersSection />;
      case 'users':
        return <UsersSection />;
      default:
        return <ProductsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative">
        <div className="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                    Painel Administrativo
                  </h1>
                </div>
                <p className="text-slate-400">Gerecimento da Kachau</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Settings size={24} />
                </button>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminCard
              icon={Package}
              title="Gerenciador de Produtos"
              description="Adicionar, editar e gerenciar produtos"
              sectionKey="products"
              count={products.length}
            />
            <AdminCard
              icon={Tag}
              title="Gerenciamento de Categorias"
              description="Controle de categorias de produtos"
              sectionKey="categories"
              count={categories.length}
            />
            <AdminCard
              icon={Truck}
              title="Gerenciamento de Pedidos"
              description="Acompanhar e gerenciar pedidos"
              sectionKey="orders"
              count={orders.length}
            />
            <AdminCard
              icon={Users}
              title="Gestão de Usuários"
              description="Administrar usuários e permissões"
              sectionKey="users"
              count={users.length}
            />
          </div>

          {/* Dynamic Content Section */}
          <div className="transition-all duration-300">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
