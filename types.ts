
export interface User {
  id: number;
  name: string;
  dob: string; // Date of Birth, stored as YYYY-MM-DD string
  score: number;
}

export type UserFormData = Omit<User, 'id'> & { id: string };

export interface FormErrors {
  id?: string;
  name?: string;
  dob?: string;
  score?: string;
}
   