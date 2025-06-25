import axios from 'axios';
const API_URL = 'https://kachau-loja.onrender.com/auth';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao fazer login');
  }

  return response.json(); 
}

export async function register(name: string, email: string, password: string, role: 'CUSTOMER' | 'ADMIN') {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    role,
  });

  return response.data;
}