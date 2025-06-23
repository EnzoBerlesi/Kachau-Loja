import api from '../services/api/api';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

export const categoryService = {
  // GET /categories - Listar todas categorias
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  // GET /categories/:id - Buscar categoria por ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // POST /categories - Criar categoria (ADMIN)
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // PUT /categories/:id - Atualizar categoria (ADMIN)
  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // DELETE /categories/:id - Deletar categoria (ADMIN)
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
