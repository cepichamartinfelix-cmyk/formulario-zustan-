
import type { User } from '../types';

// Simulating a database
let users: User[] = [
  { id: 1, name: 'Alice Smith', dob: '1995-05-20', score: 88 },
  { id: 2, name: 'Bob Johnson', dob: '1990-08-15', score: 92 },
];
let nextId = 3;

const simulateDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 700));
};

export const mockApiService = {
  searchUser: (id: number): Promise<User | null> => {
    console.log(`Searching for user with id: ${id}`);
    const user = users.find(u => u.id === id) || null;
    return simulateDelay(user);
  },

  createUser: (userData: Omit<User, 'id'>): Promise<User> => {
    console.log('Creating new user:', userData);
    const newUser: User = { ...userData, id: nextId++ };
    users.push(newUser);
    return simulateDelay(newUser);
  },

  updateUser: (userData: User): Promise<User> => {
    console.log('Updating user:', userData);
    const userIndex = users.findIndex(u => u.id === userData.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      return simulateDelay(users[userIndex]);
    }
    return Promise.reject(new Error('User not found for update'));
  },
};
   