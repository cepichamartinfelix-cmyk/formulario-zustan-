/**
 * Define los tipos de backend disponibles.
 * Agrega aquí nuevas implementaciones de servicios de API.
 */
export enum BackendType {
  MOCK = 'MOCK',
  SUPABASE = 'SUPABASE',
  BACK4APP = 'BACK4APP',
  API_CLIENT = 'API_CLIENT', // Para un backend genérico como Node.js + MySQL
}

/**
 * ================================================================
 * CONFIGURACIÓN PRINCIPAL DEL BACKEND
 * ================================================================
 * Cambia el valor de `selectedBackend` para cambiar la fuente de datos
 * de toda la aplicación.
 *
 * Opciones disponibles:
 * - `BackendType.MOCK`: Usa datos falsos en memoria. Ideal para desarrollo y pruebas.
 * - `BackendType.SUPABASE`: (No implementado) Conecta con Supabase.
 * - `BackendType.BACK4APP`: (No implementado) Conecta con Back4App.
 * - `BackendType.API_CLIENT`: (No implementado) Conecta con una API RESTful personalizada.
 */
export const backendConfig = {
  selectedBackend: BackendType.MOCK,
};