import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashPageRoutingModule } from './splash-routing.module';
import { SwiperModule } from 'swiper/angular';
import { SplashPage } from './splash.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    SplashPageRoutingModule,SwiperModule
  ],
  declarations: [SplashPage]
})
export class SplashPageModule {}
