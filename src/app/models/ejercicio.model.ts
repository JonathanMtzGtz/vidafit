export interface Ejercicio {
  id: number;
  titulo: string;
  descripcion: string;
  img: string;
  dificultad: string;
  duracion: string;
  programa?: string[];
  musculos?: string[];
  equipamiento?: string[];
  videos?: string[];
  calorias: number; // Calorías quemadas
  beneficios: string[]; // Beneficios del ejercicio
  puntaje: number; // Puntaje de progreso
  date?: string[];
  tiempo?: string[];
  nombre?: string[];
  imagen?: string[];
  // Otros campos...
}
