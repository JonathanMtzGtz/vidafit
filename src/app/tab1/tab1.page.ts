import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/dataservice';
import { Ejercicio } from '../models/ejercicio.model';
import { NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { AdMob, BannerAdOptions, InterstitialAdPluginEvents, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import SwiperCore, { Autoplay, Pagination, Scrollbar } from 'swiper';
import { SwiperOptions } from 'swiper/types';

SwiperCore.use([Autoplay, Pagination, Scrollbar]);

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  mostrarPrimero: boolean = true;
  ejercicios: Ejercicio[] = [];
  ejerciciosHome: Ejercicio[] = [];
  userData: any = null;
  posts: any[] = [];

  constructor(
    private router: Router,
    private dataService: DataService,
    private navCtrl: NavController,
    private storageService: StorageService
  ) {
    this.showBanner();
  }

  async showBanner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-1532352868322988/8383361822',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      isTesting: true,
    };

    await AdMob.showBanner(options);
    console.log('✅ Banner mostrado');
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    // Muestra el intersticial al cargar la página
    await this.showInterstitial();

    this.userData = await this.storageService.getUserData();
    console.log('Imagen de usuario:', this.userData?.photoURL);

    this.dataService.getEjercicios().subscribe(res => {
      this.ejercicios = res;
    });

    this.dataService.getEjerciciosHome().subscribe(res => {
      this.ejerciciosHome = res;
      console.log('dataejercicioshome', this.ejerciciosHome);
    });
  }

  async showInterstitial() {
    try {
      const options = {
        adId: 'ca-app-pub-1532352868322988/1353583880',
        isTesting: true,
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('✅ Anuncio intersticial mostrado');

      AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
        console.log('Anuncio intersticial mostrado');
      });
    } catch (error) {
      console.error('Error al mostrar el intersticial:', error);
    }
  }

  openPost(id: number) {
    this.navCtrl.navigateForward(`/post-detail/${id}`);
  }

  getDificultadLevel(dificultad: string): number {
    switch (dificultad.toLowerCase()) {
      case 'principiante':
        return 1;
      case 'intermedio':
        return 2;
      case 'avanzado':
        return 3;
      case 'experto':
        return 4;
      default:
        return 0;
    }
  }

  goToUserPage() {
    this.router.navigate(['/tabs/tab3']);
  }
}
