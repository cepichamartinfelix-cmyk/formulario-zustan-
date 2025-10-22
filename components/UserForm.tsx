
import React, { useState, useEffect } from 'react';
import type { UserFormData, FormErrors } from '../types';
import { useUserStore } from '../store/userStore';
import InputField from './InputField';
import Button from './Button';

const INITIAL_FORM_STATE: UserFormData = {
  id: '',
  name: '',
  dob: '',
  score: 0,
};

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { isSearching, isSubmitting, searchUser, saveUser, clearMessages, error, successMessage } = useUserStore();

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearMessages]);

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
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setIsUpdating(false);
    clearMessages();
  };

  const handleSearch = async () => {
    const id = parseInt(formData.id, 10);
    if (isNaN(id) || id <= 0) {
        setErrors(prev => ({ ...prev, id: 'Por favor, ingrese un ID numérico válido para buscar.' }));
        return;
    }
    setErrors({});
    const user = await searchUser(id);
    if (user) {
      setFormData({
        id: String(user.id),
        name: user.name,
        dob: user.dob,
        score: user.score,
      });
      setIsUpdating(true);
    } else {
      setIsUpdating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const userToSave = {
        name: formData.name,
        dob: formData.dob,
        score: Number(formData.score),
        ...(isUpdating && { id: Number(formData.id) }),
      };
      
      const result = await saveUser(userToSave);
      if (result) {
        if (!isUpdating) { // if creating
           handleReset();
        }
      }
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        {isUpdating ? 'Actualizar Usuario' : 'Registro de Usuario'}
      </h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-md">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-grow">
            <InputField
              id="id"
              label="Buscar por ID de Usuario"
              type="number"
              value={formData.id}
              onChange={handleInputChange}
              placeholder="Ej: 1"
              error={errors.id}
            />
          </div>
          <div className="mt-8">
            <Button
              onClick={handleSearch}
              disabled={isSearching || !formData.id}
              isLoading={isSearching}
              variant="secondary"
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
   