
import { create } from 'zustand';
import { mockApiService } from '../services/mockApiService';
import type { User } from '../types';

interface UserState {
  isSearching: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
  searchUser: (id: number) => Promise<User | null>;
  saveUser: (user: Omit<User, 'id'> & { id?: number }) => Promise<User | null>;
  clearMessages: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isSearching: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  searchUser: async (id: number) => {
    set({ isSearching: true, error: null, successMessage: null });
    try {
      const user = await mockApiService.searchUser(id);
      if (user) {
        set({ successMessage: `Usuario encontrado: ${user.name}` });
        return user;
      } else {
        set({ error: 'Usuario no encontrado.' });
        return null;
      }
    } catch (e) {
      set({ error: 'Error al buscar el usuario.' });
      return null;
    } finally {
      set({ isSearching: false });
    }
  },

  saveUser: async (userData) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      if (userData.id) {
        const updatedUser = await mockApiService.updateUser(userData as User);
        set({ successMessage: `Usuario ${updatedUser.name} actualizado con éxito.` });
        return updatedUser;
      } else {
        const newUser = await mockApiService.createUser(userData);
        set({ successMessage: `Usuario ${newUser.name} creado con éxito. Nuevo ID: ${newUser.id}` });
        return newUser;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
      set({ error: `Error al guardar: ${message}` });
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },
  
  clearMessages: () => {
    set({ error: null, successMessage: null });
  }
}));
   