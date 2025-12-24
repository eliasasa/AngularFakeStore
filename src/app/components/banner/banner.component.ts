import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone:true,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [
    RouterModule
  ],
})
export class BannerComponent implements AfterViewInit, OnDestroy {
  bannerImages = [
    'assets/images/banner/desktop/banner-first.jpg',
    'assets/images/banner/desktop/banner-second.jpg',
    'assets/images/banner/desktop/banner-third.jpg'
  ];

  categories = [
    'electronics',
    'jewelery',
    "women's clothing"
  ]

  currentCategory!: string;

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
          this.fadeToImage(
            (this.currentIndex + 1) % this.bannerImages.length
          );
        });
      }, 6000);
    });
  }


  fadeToImage(index: number) {
    if (this.isFading) return;

    this.isFading = true;

    setTimeout(() => {
      this.currentIndex = index;
      this.currentSrc = this.bannerImages[index];
      this.currentCategory = this.categories[index];

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
    this.currentCategory = this.categories[0];
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}