import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Ejercicio } from '../models/ejercicio.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private ejerciciosCollection: AngularFirestoreCollection<Ejercicio>;
  private ejerciciosHomeCollection: AngularFirestoreCollection<Ejercicio>;

  constructor(private afs: AngularFirestore) {
    this.ejerciciosCollection = this.afs.collection<Ejercicio>('ejercicios');
    this.ejerciciosHomeCollection = this.afs.collection<Ejercicio>('ejerciciosHome');
  }

  getEjercicios(): Observable<Ejercicio[]> {
    return this.ejerciciosCollection.valueChanges();
  }

  getEjerciciosHome(): Observable<Ejercicio[]> {
    return this.ejerciciosHomeCollection.valueChanges();
  }

 
}
