import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements AfterViewInit, OnDestroy {
  bannerImages = [
    'assets/images/banner/banner-first.jpg',
    'assets/images/banner/banner-second.jpg',
    'assets/images/banner/banner-third.jpg'
  ];

  currentSrc = this.bannerImages[0];
  private currentIndex = 0; // ✅ Variável de INSTÂNCIA
  private intervalId: any;

  ngAfterViewInit() {
    this.startRotation();
  }

  ngOnDestroy() {
    this.stopRotation();
  }

  startRotation() {
    this.stopRotation(); // Limpa intervalos existentes
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.bannerImages.length;
      this.currentSrc = this.bannerImages[this.currentIndex];
    }, 5000);
  }

  stopRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}