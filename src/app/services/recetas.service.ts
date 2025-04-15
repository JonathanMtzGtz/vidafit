import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { DEFAULT_ARTICULO, DEFAULT_RECETA } from '../utils/helpers';
import { removeSpaces } from '../utils/helpers';
interface Searchable {
  titulo: string;
  descripcion: string;
};

// Interfaz base para artículos simples (estilo de vida, fitness, salud mental)
export interface ArticuloSimple {
  id?: string;
  titulo: string;
  descripcion: string;
  img: string;
}

// Interfaz específica para recetas
export interface Receta {
  id?: string;
  titulo: string;
  descripcion: string;
  img: string;
  ingredientes: string[];
  preparacion: string[];
  kalorias?: number;
  beneficios?: string[];
  categoria: string;
}

// Interfaz para artículos generales
export interface Articulo extends ArticuloSimple {
  contenido: string;
  autor?: string;
  fechaPublicacion?: Date;
  tiempoLectura?: number;
}

const DEFAULT_ARTICULO: ArticuloSimple = {
  titulo: '',
  descripcion: '',
  img: ''
};

@Injectable({
  providedIn: 'root'
})
export class RecetasService {  constructor(private firestore: AngularFirestore) { }
      .valueChanges({ idField: 'id' });
  }

  // Métodos específicos para recetas
  getRecetas(): Observable<Receta[]> {
    return this.firestore.collection<Receta>('recetas').valueChanges({ idField: 'id' });
  }

  getRecetaById(id: string): Observable<Receta> {
    return this.firestore.doc<Receta>(`recetas/${id}`).valueChanges()
      .pipe(
        map(receta => {
          const recetaResult: Receta = receta || DEFAULT_RECETA;

          return this.processReceta(recetaResult);      
        }) 
      }
      );
  }

  private processReceta(receta: Receta): Receta {
    let ingredientesProcesados: string[] = [];

    if (receta.ingredientes) {
      if (Array.isArray(receta.ingredientes)) {
        ingredientesProcesados = receta.ingredientes;
      } else if (typeof receta.ingredientes === 'string') {
        ingredientesProcesados = receta.ingredientes.split(',').map(i => i.trim());
      } else if (typeof receta.ingredientes === 'object' && receta.ingredientes !== null) {
        ingredientesProcesados = Object.values(receta.ingredientes);
      }
    }

    return {
      ...receta,
      ingredientes: ingredientesProcesados
    }
  }

  searchRecetas(searchTerm: string): Observable<Receta[]> {
    return this.searchItems<Receta>(searchTerm, 'recetas') as Observable<Receta[]>;
  }

  addReceta(receta: Receta): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('recetas').doc(id).set({ ...receta, id: id });
  }

  getRecetasByCategoria(categoria: string): Observable<Receta[]> {
    return this.getItemsByColeccion<Receta>('recetas', categoria);
  }

  getArticulosByCategoria(categoria: string): Observable<ArticuloSimple[]> {
    return this.getItemsByColeccion<ArticuloSimple>('articulos', categoria);
  }

  // Método para búsqueda general
  searchItems<T extends Searchable>(searchTerm: string, coleccion: string): Observable<T[]> {
    return this.getItemsByColeccion<T>(coleccion).pipe(
      map(items => {
        const termino = removeSpaces(searchTerm.toLowerCase());
        return items.filter(item => {
          return removeSpaces(item.titulo?.toLowerCase()).includes(termino) ||
                 removeSpaces(item.descripcion?.toLowerCase()).includes(termino);
        });
      })
    );
  }

  private getItemsByColeccion<T extends ArticuloSimple | Receta>(coleccion: string, categoria?: string): Observable<T[]> {
    return this.firestore.collection<T>(coleccion, ref => categoria ? ref.where('categoria', '==', categoria) : ref)
      .valueChanges({ idField: 'id' });
  }


}