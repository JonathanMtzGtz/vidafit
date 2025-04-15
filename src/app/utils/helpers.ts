import { Auth, User } from '@angular/fire/auth';

export const removeSpaces = (str: string): string => {
  return str.replace(/\s/g, '');
};

export const DEFAULT_RECETA = {
  titulo: '',
  descripcion: '',
  img: '',
  ingredientes: [],
  preparacion: [],
  kalorias: 0,
  beneficios: [],
  categoria: 'nutricion'
};

export const DEFAULT_ARTICULO = {
  titulo: '',
  descripcion: '',
  img: '',
  contenido: '',
  autor: '',
  fechaPublicacion: new Date(),
  tiempoLectura: 0,
};

export const getUser = (auth: Auth): User | null => {
  const user = auth.currentUser;
  if (!user) return null;
  return user;
};