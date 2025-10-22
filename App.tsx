import React from 'react';
import UserForm from './components/UserForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crea una instancia del cliente
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
              Formulario Dinámico
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Un formulario completo para buscar, crear y actualizar registros con validación y gestión de estado.
          </p>
        </header>
        <main className="w-full">
          <UserForm />
        </main>
        <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Desarrollado con React, TanStack Query, y Tailwind CSS.</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;