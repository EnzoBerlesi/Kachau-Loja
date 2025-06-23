import api from '../services/api/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export type UpdateProductData = Partial<CreateProductData>;

export const productService = {
  // GET /products - Listar todos produtos
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  // GET /products/:id - Buscar produto por ID
  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // POST /products - Criar produto (ADMIN)
  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data;
  },

  // PUT /products/:id - Atualizar produto (ADMIN)
  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // DELETE /products/:id - Deletar produto (ADMIN)
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
