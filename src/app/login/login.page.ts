import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';

import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
   
    private firestore: Firestore
  ) {}

  ngOnInit() {
    // Verificar si el usuario ya está autenticado
 
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToRegister() {
    this.router.navigate(['/registro']);
  }

  goToForgotPassword() {
    this.router.navigate(['/registro']); // Cambia esto si tienes una página específica para recuperar contraseña
  }

  async login() {
    if (this.email.trim() === '' || this.password.trim() === '') {
      this.presentAlert('Campos Vacíos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      const userCredential = await this.authService.login(this.email, this.password);
      const user = userCredential.user;

      if (user) {
        const hasProfile = await this.checkUserProfile(user.uid);
        this.router.navigate([hasProfile ? '/tabs' : '/profile']);
      }
    } catch (error: any) {
      let errorMessage = 'Error de inicio de sesión';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado. Verifica tu correo electrónico.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta. Intenta de nuevo.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido.';
          break;
        default:
          errorMessage = `Error desconocido: ${error.message}`;
          break;
      }
      this.presentAlert('Error de inicio de sesión', errorMessage);
    }
  }

  async checkUserProfile(uid: string): Promise<boolean> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userRef);
    return docSnap.exists();
  }
}
