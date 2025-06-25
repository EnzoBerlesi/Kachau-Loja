import api from '../services/api/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
}

export const userService = {
  // GET /users - Listar todos usuários (ADMIN) - assumindo que existe
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  // GET /users?role=CUSTOMER - Listar usuários por role
  async getUsersByRole(role: 'CUSTOMER' | 'ADMIN'): Promise<User[]> {
    const response = await api.get(`/users?role=${role}`);
    return response.data;
  },

  // GET /users/:id - Buscar usuário por ID (ADMIN) - assumindo que existe
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // DELETE /users/:id - Deletar usuário (ADMIN) - assumindo que existe
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // PUT /users/:id/role - Atualizar role do usuário (ADMIN) - assumindo que existe
  async updateUserRole(id: string, role: 'CUSTOMER' | 'ADMIN'): Promise<User> {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },
};
