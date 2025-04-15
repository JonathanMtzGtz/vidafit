import { Injectable } from '@angular/core';
import * as localForage from 'localforage';
import { UserData } from '../models/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: LocalForage;
  private storageReady: Promise<void>;

  constructor() {
    this.storage = localForage.createInstance({
      name: 'vidafit_storage',
    });
    this.storageReady = this.storage.ready();
  }

  async getUserData(): Promise<UserData | null> { // Use UserData type
    await this.storageReady;
    try {
      const userData: UserData | null = await this.storage.getItem('userData'); // Use UserData type
      if (userData && userData.photoURL) {
        console.log('Imagen de usuario:', userData.photoURL);
        return userData;
      } else {
        console.log('No se encontró photoURL en los datos guardados.');
        return userData; // Return null or the empty object
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return null;
    }
  }

  async setUserData(data: UserData): Promise<void> { // Use UserData type
    await this.storageReady;
    try {
      await this.storage.setItem('userData', data);
    } catch (error) {
      console.error('Error al guardar los datos del usuario:', error);
    }
  }
}
