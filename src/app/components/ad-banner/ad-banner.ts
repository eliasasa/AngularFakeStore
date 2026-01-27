import {
  Component,
  Input,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AdBannerData } from '../../interfaces/add-banner/ad-banner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  templateUrl: './ad-banner.html',
  styleUrl: './ad-banner.scss',
  imports: [RouterLink],
})
export class AdBannerComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) ad!: AdBannerData;

  currentImageUrl!: string;

  private mediaQuery!: MediaQueryList;
  private mediaListener!: (event: MediaQueryListEvent) => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private initMediaQuery() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.mediaQuery = window.matchMedia('(max-width: 768px)');
    this.updateImage(this.mediaQuery.matches);

    this.mediaListener = (event: MediaQueryListEvent) => {
      this.updateImage(event.matches);
    };

    this.mediaQuery.addEventListener('change', this.mediaListener);
  }

  private updateImage(isMobile: boolean) {
    this.currentImageUrl =
      isMobile && this.ad.mobileImageUrl
        ? this.ad.mobileImageUrl
        : this.ad.desktopImageUrl;
  }

  ngAfterViewInit() {
    this.initMediaQuery();
  }

  ngOnDestroy() {
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
    }
  }
}
