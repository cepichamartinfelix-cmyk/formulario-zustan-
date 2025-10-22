import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserFormData, FormErrors, User } from '../types';
import apiService from '../services/apiService';
import InputField from './InputField';
import Button from './Button';

const INITIAL_FORM_STATE: UserFormData = {
  id: '',
  name: '',
  dob: '',
  score: 0,
};

// Componente para mostrar notificaciones
const Notification = ({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void; }) => {
  const baseClasses = "mb-4 p-3 border rounded-md flex justify-between items-center";
  const typeClasses = {
    success: "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 text-green-700 dark:text-green-200",
    error: "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-700 dark:text-red-200",
  };

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span>{message}</span>
      <button onClick={onDismiss} className="font-bold text-lg">&times;</button>
    </div>
  );
};


const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const queryClient = useQueryClient();

  // Query para buscar un usuario. Deshabilitada por defecto.
  const { isFetching: isSearching, refetch: executeSearch } = useQuery({
    queryKey: ['user', searchId],
    queryFn: () => apiService.searchUser(parseInt(searchId, 10)),
    enabled: false, // Solo se ejecuta al llamar a refetch
    retry: false,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          id: String(data.id),
          name: data.name,
          dob: data.dob,
          score: data.score,
        });
        setIsUpdating(true);
        setNotification({ type: 'success', message: `Usuario encontrado: ${data.name}` });
      } else {
        setNotification({ type: 'error', message: 'Usuario no encontrado.' });
        setIsUpdating(false);
      }
    },
    onError: (error) => {
      setNotification({ type: 'error', message: error.message });
      setIsUpdating(false);
    }
  });
  
  // Mutación para crear un usuario
  const createUserMutation = useMutation({
    mutationFn: (newUser: Omit<User, 'id'>) => apiService.createUser(newUser),
    onSuccess: (newUser) => {
      setNotification({ type: 'success', message: `Usuario ${newUser.name} creado con éxito. Nuevo ID: ${newUser.id}` });
      handleReset(); // Limpia el formulario después de crear
    },
    onError: (error) => {
      setNotification({ type: 'error', message: `Error al crear: ${error.message}` });
    },
  });

  // Mutación para actualizar un usuario
  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: User) => apiService.updateUser(updatedUser),
    onSuccess: (updatedUser) => {
      setNotification({ type: 'success', message: `Usuario ${updatedUser.name} actualizado con éxito.` });
      // Invalida la query para que la próxima búsqueda obtenga los datos frescos
      queryClient.invalidateQueries({ queryKey: ['user', String(updatedUser.id)] });
    },
    onError: (error) => {
      setNotification({ type: 'error', message: `Error al actualizar: ${error.message}` });
    },
  });

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    }
    if (!formData.dob) {
      newErrors.dob = 'La fecha de nacimiento es obligatoria.';
    } else if (new Date(formData.dob) > new Date()) {
      newErrors.dob = 'La fecha de nacimiento no puede ser en el futuro.';
    }
    const scoreNum = Number(formData.score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      newErrors.score = 'La puntuación debe ser un número entre 0 y 100.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Maneja el campo de búsqueda de ID por separado
    if (id === 'id-search') {
        setSearchId(value);
    } else {
        setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setSearchId('');
    setErrors({});
    setIsUpdating(false);
    setNotification(null);
  };

  const handleSearch = () => {
    const id = parseInt(searchId, 10);
    if (isNaN(id) || id <= 0) {
      setErrors({ id: 'Por favor, ingrese un ID numérico válido para buscar.' });
      return;
    }
    setErrors({});
    setNotification(null);
    executeSearch();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    if (validate()) {
      if (isUpdating) {
        updateUserMutation.mutate({
          id: Number(formData.id),
          name: formData.name,
          dob: formData.dob,
          score: Number(formData.score),
        });
      } else {
        createUserMutation.mutate({
          name: formData.name,
          dob: formData.dob,
          score: Number(formData.score),
        });
      }
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        {isUpdating ? 'Actualizar Usuario' : 'Registro de Usuario'}
      </h2>
      
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onDismiss={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-grow">
            <InputField
              id="id-search"
              label="Buscar por ID de Usuario"
              type="number"
              value={searchId}
              onChange={handleInputChange}
              placeholder="Ej: 1"
              error={errors.id}
            />
          </div>
          <div className="mt-8">
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchId}
              isLoading={isSearching}
              variant="secondary"
              type="button"
            >
              Buscar
            </Button>
          </div>
        </div>
        
        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <InputField
          id="name"
          label="Nombre Completo"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="Ej: Juan Pérez"
        />

        <InputField
          id="dob"
          label="Fecha de Nacimiento"
          type="date"
          value={formData.dob}
          onChange={handleInputChange}
          error={errors.dob}
        />
        
        <InputField
          id="score"
          label="Puntuación"
          type="number"
          value={formData.score.toString()}
          onChange={handleInputChange}
          error={errors.score}
          placeholder="0-100"
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
              onClick={handleReset}
              variant="danger"
              type="button"
          >
              Resetear
          </Button>
          <Button
              onClick={() => {}}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              variant="primary"
              type="submit"
          >
              {isUpdating ? 'Actualizar' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;