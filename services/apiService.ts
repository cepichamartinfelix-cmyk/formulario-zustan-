import { backendConfig, BackendType } from '../config/backendConfig';
import { mockApiService } from './mockApiService';
import type { IApiService } from './apiTypes';

// --- Placeholder/Stub Implementations ---
// En un proyecto real, estos serían archivos separados (ej. supabaseService.ts)
// y tendrían la lógica de conexión real.

const notImplementedService: IApiService = {
  searchUser: async () => { throw new Error('Servicio no implementado.'); },
  createUser: async () => { throw new Error('Servicio no implementado.'); },
  updateUser: async () => { throw new Error('Servicio no implementado.'); },
};

// const supabaseService: IApiService = notImplementedService; // Import from './supabaseService'
// const back4appService: IApiService = notImplementedService; // Import from './back4appService'
// const apiClientService: IApiService = notImplementedService; // Import from './apiClientService'


let apiService: IApiService;

switch (backendConfig.selectedBackend) {
  case BackendType.MOCK:
    apiService = mockApiService;
    break;
  // Descomenta y completa estos casos cuando implementes los servicios reales
  // case BackendType.SUPABASE:
  //   apiService = supabaseService;
  //   break;
  // case BackendType.BACK4APP:
  //   apiService = back4appService;
  //   break;
  // case BackendType.API_CLIENT:
  //   apiService = apiClientService;
  //   break;
  default:
    console.warn(`Backend "${backendConfig.selectedBackend}" no reconocido o implementado. Usando MOCK por defecto.`);
    apiService = mockApiService;
}

export default apiService;