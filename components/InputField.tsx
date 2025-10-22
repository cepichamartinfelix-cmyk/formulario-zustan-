
import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, onChange, error, placeholder, disabled = false }) => {
  const baseClasses = "w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200";
  const errorClasses = "border-red-500 focus:ring-red-500";
  const normalClasses = "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500";
  const disabledClasses = "bg-gray-200 dark:bg-gray-700 cursor-not-allowed";

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClasses} ${error ? errorClasses : normalClasses} ${disabled ? disabledClasses : ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
   