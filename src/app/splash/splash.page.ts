import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Scrollbar } from 'swiper';
import { SwiperOptions } from 'swiper/types';

SwiperCore.use([Autoplay, Pagination, Scrollbar]);



@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
})
export class SplashPage implements OnInit {
  config: SwiperOptions= {
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
    },
    scrollbar: {
      draggable: true,
    },
  };
  constructor(private router: Router) {
    console.log('Splash constructor called');
  }

  ngOnInit() {
 
  }

  onSwiper(swiper: any) {
    console.log('Swiper instance:', swiper);
  }

  start() {
    
    this.router.navigate(['login']);
  }
}
