import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener artículos por colección específica
  getArticulosByColeccion(coleccion: string): Observable<ArticuloSimple[]> {
    return this.firestore.collection<ArticuloSimple>(coleccion)
      .valueChanges({ idField: 'id' });
  }

  // Obtener un artículo específico por ID y colección
  getArticuloById(coleccion: string, id: string): Observable<ArticuloSimple> {
    return this.firestore.doc<ArticuloSimple>(`${coleccion}/${id}`).valueChanges()
      .pipe(
        map(articulo => {
          if (!articulo) {
            return {
              titulo: '',
              descripcion: '',
              img: ''
            } as ArticuloSimple;
          }
          return articulo;
        })
      );
  }

  // Métodos específicos para recetas
  getRecetas(): Observable<Receta[]> {
    return this.firestore.collection<Receta>('recetas').valueChanges({ idField: 'id' });
  }

  getRecetaById(id: string): Observable<Receta> {
    return this.firestore.doc<Receta>(`recetas/${id}`).valueChanges()
      .pipe(
        map(receta => {
          if (!receta) {
            return {
              titulo: '',
              descripcion: '',
              img: '',
              ingredientes: [],
              preparacion: [],
              kalorias: 0,
              beneficios: [],
              categoria: 'nutricion'
            } as Receta;
          }

          let ingredientesProcesados: string[] = [];
          
          if (receta.ingredientes) {
            console.log('Tipo de ingredientes:', typeof receta.ingredientes);
            console.log('Es array?:', Array.isArray(receta.ingredientes));
            console.log('Valor de ingredientes:', receta.ingredientes);

            if (Array.isArray(receta.ingredientes)) {
              ingredientesProcesados = receta.ingredientes;
            } else if (typeof receta.ingredientes === 'string') {
              ingredientesProcesados = (receta.ingredientes as string).split(',').map(i => i.trim());
            } else if (typeof receta.ingredientes === 'object') {
              ingredientesProcesados = Object.values(receta.ingredientes);
            }
          }

          const recetaProcesada = {
            id: receta.id,
            titulo: receta.titulo || '',
            descripcion: receta.descripcion || '',
            img: receta.img || '',
            ingredientes: ingredientesProcesados,
            preparacion: receta.preparacion || [],
            kalorias: receta.kalorias || 0,
            beneficios: receta.beneficios || [],
            categoria: receta.categoria || 'nutricion'
          };

          console.log('Receta procesada:', recetaProcesada);
          console.log('Ingredientes procesados:', recetaProcesada.ingredientes);

          return recetaProcesada;
        })
      );
  }

  searchRecetas(searchTerm: string): Observable<Receta[]> {
    return this.getRecetas().pipe(
      map(recetas => {
        const termino = searchTerm.toLowerCase().trim();
        return recetas.filter(receta => {
          const tituloMatch = receta.titulo?.toLowerCase().includes(termino) || false;
          const descripcionMatch = receta.descripcion?.toLowerCase().includes(termino) || false;
          const ingredientesMatch = Array.isArray(receta.ingredientes) ? 
            receta.ingredientes.some(ingrediente => 
              ingrediente?.toLowerCase().includes(termino)
            ) : false;

          return tituloMatch || descripcionMatch || ingredientesMatch;
        });
      })
    );
  }

  addReceta(receta: Receta): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('recetas').doc(id).set({
      ...receta,
      id: id
    });
  }

  getRecetasByCategoria(categoria: string): Observable<Receta[]> {
    return this.getRecetas().pipe(
      map(recetas => recetas.filter(receta => receta.categoria === categoria))
    );
  }

  async addTestReceta() {
    const recetaPrueba: Receta = {
      titulo: "Ensalada de Pollo y Aguacate",
      descripcion: "Una ensalada saludable y deliciosa",
      img: "assets/img/ensalada.jpg",
      ingredientes: [
        "200g de pechuga de pollo",
        "1 aguacate",
        "2 tazas de espinacas",
        "1 pepino",
        "1/4 cebolla morada"
      ],
      preparacion: [
        "Cocinar el pollo a la plancha",
        "Cortar el aguacate en rodajas",
        "Mezclar todos los ingredientes",
        "Agregar sal y pimienta al gusto"
      ],
      kalorias: 350,
      beneficios: [
        "Alto en proteínas",
        "Rico en grasas saludables",
        "Bajo en carbohidratos",
        "Excelente fuente de fibra"
      ],
      categoria: 'nutricion'
    };
    
    await this.addReceta(recetaPrueba);
  }

  getArticulosByCategoria(categoria: string): Observable<ArticuloSimple[]> {
    return this.firestore.collection<ArticuloSimple>('articulos', ref => 
      ref.where('categoria', '==', categoria)
    ).valueChanges({ idField: 'id' });
  }

  // Método para búsqueda general
  searchItems(searchTerm: string, coleccion: string): Observable<ArticuloSimple[]> {
    return this.getArticulosByColeccion(coleccion).pipe(
      map(items => {
        const termino = searchTerm.toLowerCase().trim();
        return items.filter(item => 
          item.titulo.toLowerCase().includes(termino) ||
          item.descripcion.toLowerCase().includes(termino)
        );
      })
    );
  }
} 