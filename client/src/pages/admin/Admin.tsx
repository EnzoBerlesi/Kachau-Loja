import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Users,
  Tag,
  BarChart3,
  FileText,
} from "lucide-react";
import { productService, type Product } from "../../services/productService";
import { categoryService, type Category } from "../../services/categoryService";
import { orderService, type Order } from "../../services/orderService";
import { userService, type User } from "../../services/userService";
import { AdminHeader, AdminCard } from "../../components/admin";
import { ProductsSection, CategoriesSection, OrdersSection, UsersSection } from "../../components/sections";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("products");

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
        case "products": {
          const productsData = await productService.getAllProducts();
          setProducts(productsData);
          break;
        }
        case "categories": {
          const categoriesData = await categoryService.getAllCategories();
          setCategories(categoriesData);
          break;
        }
        case "orders": {
          const ordersData = await orderService.getAllOrders();
          console.log("Orders data:", ordersData);
          setOrders(ordersData);
          break;
        }
        case "users": {
          const usersData = await userService.getAllUsers();
          setUsers(usersData);
          break;
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(errorMessage);
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  // Carrega dados quando a seção muda
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar produto";
      setError(errorMessage);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta categoria?")) return;

    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar categoria";
      setError(errorMessage);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      await userService.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar usuário";
      setError(errorMessage);
    }
  };

  const handleUpdateOrderStatus = async (
    id: string,
    status: Order["status"]
  ) => {
    try {
      await orderService.updateOrderStatus(id, { status });
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao atualizar status do pedido";
      setError(errorMessage);
    }
  };

  const handleAddProduct = () => {
    // Recarrega os produtos após adicionar um novo
    if (activeSection === "products") {
      loadData();
    }
  };

  const handleAddCategory = () => {
    // Recarrega as categorias após adicionar uma nova
    if (activeSection === "categories") {
      loadData();
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "products":
        return (
          <ProductsSection
            products={products}
            loading={loading}
            error={error}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={handleAddProduct}
          />
        );
      case "categories":
        return (
          <CategoriesSection
            categories={categories}
            loading={loading}
            error={error}
            onDeleteCategory={handleDeleteCategory}
            onAddCategory={handleAddCategory} 
          />
        );
      case "orders":
        return (
          <OrdersSection
            orders={orders}
            loading={loading}
            error={error}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case "users":
        return (
          <UsersSection
            users={users}
            loading={loading}
            error={error}
            onDeleteUser={handleDeleteUser}
          />
        );
      default:
        return (
          <ProductsSection
            products={products}
            loading={loading}
            error={error}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={handleAddProduct}
          />
        );
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
        <AdminHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminCard
              icon={Package}
              title="Gerenciador de Produtos"
              description="Adicionar, editar e gerenciar produtos"
              sectionKey="products"
              count={products.length}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <AdminCard
              icon={Tag}
              title="Gerenciamento de Categorias"
              description="Controle de categorias de produtos"
              sectionKey="categories"
              count={categories.length}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <AdminCard
              icon={Truck}
              title="Gerenciamento de Pedidos"
              description="Acompanhar e gerenciar pedidos"
              sectionKey="orders"
              count={orders.length}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            <AdminCard
              icon={Users}
              title="Gestão de Usuários"
              description="Administrar usuários e permissões"
              sectionKey="users"
              count={users.length}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* Relatórios Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/reports-dashboard"
              className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Dashboard de Relatórios</h3>
                  <p className="text-purple-200/80 text-sm">Visão geral do desempenho da loja</p>
                </div>
              </div>
            </Link>

            <Link
              to="/reports"
              className="bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Relatórios Detalhados</h3>
                  <p className="text-green-200/80 text-sm">Vendas, clientes, canais e estoque</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Dynamic Content Section */}
          <div className="transition-all duration-300">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
