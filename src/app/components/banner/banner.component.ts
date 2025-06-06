import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone:true,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements AfterViewInit {
  bannerImages = [
    'assets/images/banner/banner-first.jpg',
    'assets/images/banner/banner-second.jpg',
    'assets/images/banner/banner-third.jpg'
  ];

  currentSrc = this.bannerImages[0];
  protected currentIndex = 0;
  private interval: any;
  isFading = false;
  private fadeDuration = 300;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {}

  startBannerRotation() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.interval) clearInterval(this.interval);

    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          this.fadeToImage((this.currentIndex + 1) % this.bannerImages.length);
        });
      }, 5000);
    });
  }

  fadeToImage(index: number) {
    if (this.isFading) return;
    this.isFading = true;
    setTimeout(() => {
      this.currentIndex = index;
      this.currentSrc = this.bannerImages[this.currentIndex];
      setTimeout(() => {
        this.isFading = false;
      }, this.fadeDuration);
    }, this.fadeDuration);
  }

  goToImage(index: number) {
    if (index === this.currentIndex || this.isFading) return;
    this.fadeToImage(index);
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