import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit, AfterViewInit{

  searchBind!: string;
  isMobileView = false;
  bannerPath!: string;
  private viewInitialized = false;


  bannerMap: Record<string, string> = {
    'electronics': 'assets/images/categories/electronics',
    'jewelery': 'assets/images/categories/jewelery',
    "women's clothing": 'assets/images/categories/women'
  }

  @ViewChild('bannerImg') bannerImg!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  private detectScreen() {
    this.isMobileView = window.innerWidth <= 768;
  }

  ngOnInit(): void {

    this.detectScreen();

    this.route.paramMap.subscribe(params => {
      const encodeBind = params.get('bind');

      if (encodeBind) {
        this.searchBind = decodeURIComponent(encodeBind);
      }

      if (this.viewInitialized) {
        this.setBanner();
      }

    })
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.setBanner();
  }

  @HostListener('window:resize')
    checkScreen() {
      this.detectScreen();
      this.setBanner();
    }

  setBanner() {

    const device = this.isMobileView ? 'mobile' : 'desktop';

    this.bannerPath = `assets/images/banner/${device}/banner-first.jpg`

    if (!this.searchBind) return

    if (this.bannerMap[this.searchBind]) {
      const bannerKey = this.bannerMap[this.searchBind];
      this.bannerPath = `${bannerKey}/${device}.png`
    }

    requestAnimationFrame(() => {
      if (this.bannerImg) {
        this.renderer.addClass(this.bannerImg.nativeElement, 'fading');
      }
    });

  }

  onImageLoad() {
    if (this.bannerImg) {
      this.renderer.addClass(this.bannerImg.nativeElement, 'fading');
    }
  }

}
