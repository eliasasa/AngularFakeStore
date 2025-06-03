import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone:true,
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
  private currentIndex = 0;
  private interval: any;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {}

  startBannerRotation() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.interval) clearInterval(this.interval);

    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          this.currentIndex = (this.currentIndex + 1) % this.bannerImages.length;
          this.currentSrc = this.bannerImages[this.currentIndex];
        });
      }, 3000);
    });
  }

  ngAfterViewInit() {
    this.startBannerRotation();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}