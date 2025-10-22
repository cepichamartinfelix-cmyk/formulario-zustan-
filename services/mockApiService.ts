import type { User } from '../types';
import type { IApiService } from './apiTypes';

// Simulating a database
let users: User[] = [
  { id: 1, name: 'Alice Smith', dob: '1995-05-20', score: 88 },
  { id: 2, name: 'Bob Johnson', dob: '1990-08-15', score: 92 },
];
let nextId = 3;

const simulateDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 700));
};

class MockApiService implements IApiService {
  async searchUser(id: number): Promise<User | null> {
    console.log(`(Mock) Searching for user with id: ${id}`);
    const user = users.find(u => u.id === id) || null;
    return simulateDelay(user);
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    console.log('(Mock) Creating new user:', userData);
    const newUser: User = { ...userData, id: nextId++ };
    users.push(newUser);
    return simulateDelay(newUser);
  }

  async updateUser(userData: User): Promise<User> {
    console.log('(Mock) Updating user:', userData);
    const userIndex = users.findIndex(u => u.id === userData.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      return simulateDelay(users[userIndex]);
    }
    return Promise.reject(new Error('User not found for update'));
  }
}

export const mockApiService = new MockApiService();