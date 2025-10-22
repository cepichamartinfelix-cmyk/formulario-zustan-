import type { User } from '../types';

export interface IApiService {
  searchUser: (id: number) => Promise<User | null>;
  createUser: (userData: Omit<User, 'id'>) => Promise<User>;
  updateUser: (userData: User) => Promise<User>;
}