import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent  {
  bannerImages = [
    'assets/images/banner/banner-first.jpg',
    'assets/images/banner/banner-second.jpg',
    'assets/images/banner/banner-third.jpg'
  ];

  currentSrc = this.bannerImages[0];
  private currentIndex = 0; // ✅ Variável de INSTÂNCIA

}