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
  bannerBasePaths = [
    'assets/images/categories/electronics',
    'assets/images/categories/jewelery',
    'assets/images/categories/women'
  ];

  categories = [
    'electronics',
    'jewelery',
    "women's clothing"
  ]

  currentCategory!: string;

  isMobileView = false;

  private mediaQuery!: MediaQueryList;
  private mediaListener!: (event: MediaQueryListEvent) => void;

  currentSrc!: string;
  protected currentIndex = 0;
  private interval: any;
  isFading = false;
  private fadeDuration = 300;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {}

  private initMediaQuery() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.mediaQuery = window.matchMedia('(max-width: 768px)');
    this.isMobileView = this.mediaQuery.matches;

    this.mediaListener = (event: MediaQueryListEvent) => {
      this.isMobileView = event.matches;
      this.updateBannerSrc();
    };

    this.mediaQuery.addEventListener('change', this.mediaListener);
  }

  private getDevice(): 'mobile' | 'desktop' {
    return this.isMobileView ? 'mobile' : 'desktop';
  }

  private updateBannerSrc() {
    const device = this.getDevice();
    this.currentSrc = `${this.bannerBasePaths[this.currentIndex]}/${device}.png`;
  }

  startBannerRotation() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.interval) clearInterval(this.interval);

    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          this.fadeToImage(
            (this.currentIndex + 1) % this.bannerBasePaths.length
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
      this.currentCategory = this.categories[index];
      this.updateBannerSrc();

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
    this.initMediaQuery();
    this.currentCategory = this.categories[0];
    this.currentIndex = 0;
    this.updateBannerSrc();
    this.startBannerRotation();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
    }
  }

}