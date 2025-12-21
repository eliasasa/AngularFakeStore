import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product-service';
import { ProductCard } from '../../components/product-card/product-card';
import { Load } from '../../components/load/load';
import { Product } from '../../interfaces/product/product';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [
    ProductCard,
    Load,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit, AfterViewInit{

  searchBind!: string;
  isMobileView = false;
  bannerPath!: string;
  private viewInitialized = false;

  productList!: Product[];
  loading: boolean = false;
  error: boolean = false;

  bannerMap: Record<string, string> = {
    'electronics': 'assets/images/categories/electronics',
    'jewelery': 'assets/images/categories/jewelery',
    "women's clothing": 'assets/images/categories/women'
  }

  filters: any[] = [
    { title: 'Todos', value: 'all', materialIcon: 'list' },
    { title: 'Eletrônicos', value: 'electronics', materialIcon: 'devices' },
    { title: 'Joias', value: 'jewelery', materialIcon: 'diamond' },
    { title: 'Masculino', value: "men's clothing", materialIcon: 'man' },
    { title: 'Feminino', value: "women's clothing", materialIcon: 'woman' }
  ];

  selectedCategories: string[] = [];

  @ViewChild('bannerImg') bannerImg!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private productService: ProductService,
    private router: Router
  ) {}

  private detectScreen() {
    this.isMobileView = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this.detectScreen();

    this.route.queryParamMap.subscribe(params => {
      this.searchBind = params.get('q') || '';
      const catParam = params.get('cat');

      this.selectedCategories = catParam ? catParam.split(',') : [];

      const filter = this.filters.find(f => f.value === this.searchBind);
      if (filter && this.selectedCategories.length === 0) {
        this.selectedCategories = [filter.value];
      }

      if (this.viewInitialized) {
        this.setBanner();
      }

      if (this.selectedCategories.length > 0) {
        this.loadProductsByFilter(this.selectedCategories);
      } else {
        this.loadAllProducts();
      }
    });
  }


  updateUrl() {
    const queryParams: any = {};

    if (this.searchBind?.trim()) {
      queryParams.q = this.searchBind.trim();
    }

    if (this.selectedCategories.length > 0) {
      queryParams.cat = this.selectedCategories.join(',');
    }

    this.router.navigate(['/categories'], { queryParams });
  }

  isChecked(value: string): boolean {
    if (value === 'all') {
      return this.selectedCategories.length === 0;
    }
    return this.selectedCategories.includes(value);
  }

  onCheckboxChange(value: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (value === 'all') {
      this.selectedCategories = [];
      this.updateUrl();
      return;
    }

    if (checked) {
      this.selectedCategories.push(value);
    } else {
      this.selectedCategories = this.selectedCategories.filter(v => v !== value);
    }

    this.updateUrl();
  }

  loadProductsByFilter(categories: string[]): void {
    this.loading = true;
    this.error = false;
    this.productList = [];

    const requests = categories.map(c =>
      this.productService.getProductsByCategory(c)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        this.productList = results.flat();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        console.error('Erro na filtragem:', err);
      }
    });
  }

  loadAllProducts() {
    this.loading = true;
    this.error = false;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.productList = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        console.error('Error ao carregar produtos: ', err)
      }
    })

  }

  getProductValue() {

  }

  // BANNER LOGIC

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
    this.bannerPath = `assets/images/banner/${device}/banner-first.jpg`;

    if (this.selectedCategories.length === 1) {
      const category = this.selectedCategories[0];
      if (this.bannerMap[category]) {
        this.bannerPath = `${this.bannerMap[category]}/${device}.png`;
      }
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
