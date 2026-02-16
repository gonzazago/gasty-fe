/**
 * Configuración de la API
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  endpoints: {
    expenses: '/api/expenses',
    banks: '/api/banks',
    cards: '/api/cards',
  },
} as const;

/**
 * Construye la URL completa para un endpoint
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.baseUrl}${endpoint}`;
}

