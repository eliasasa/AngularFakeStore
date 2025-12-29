import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product-service';
import { ProductCard } from '../../components/product-card/product-card';
import { Load } from '../../components/load/load';
import { Product } from '../../interfaces/product/product';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [
    ProductCard,
    Load,
    FormsModule 
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
  allProducts!: Product[];
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

  minPrice: number | null = null;
  maxPrice: number | null = null;


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

  private mediaQuery!: MediaQueryList;
  private mediaListener!: (event: MediaQueryListEvent) => void;

  ngOnInit(): void {
    this.mediaQuery = window.matchMedia('(max-width: 768px)');
    this.isMobileView = this.mediaQuery.matches;

    this.mediaListener = (event: MediaQueryListEvent) => {
      this.isMobileView = event.matches;
      this.setBanner();
    };

  this.mediaQuery.addEventListener('change', this.mediaListener);
    this.route.queryParamMap.subscribe(params => {
      this.searchBind = params.get('q') || '';

      const catParam = params.get('cat');
      this.selectedCategories = catParam ? catParam.split(',') : [];

      const minParam = params.get('min');
      const maxParam = params.get('max');

      this.minPrice = minParam !== null ? Number(minParam) : null;
      this.maxPrice = maxParam !== null ? Number(maxParam) : null;

      this.setBanner();

      if (this.selectedCategories.length > 0) {
        this.loadProductsByFilter(this.selectedCategories);
      } else {
        this.loadAllProducts();
      }
    });
  }

  clearBind() {
    this.searchBind = '';
    this.selectedCategories = [];

    this.router.navigate(['/categorias'], {
      queryParams: {}    
    });
  }

  updateUrl() {
    const queryParams: any = {};

    if (this.searchBind?.trim()) {
      queryParams.q = this.searchBind.trim();
    }

    if (this.selectedCategories.length > 0) {
      queryParams.cat = this.selectedCategories.join(',');
    } else {
      queryParams.cat = null; // 👈 remove da URL
    }

    if (this.minPrice !== null && this.minPrice > 0) {
      queryParams.min = this.minPrice;
    } else {
      queryParams.min = null;
    }

    if (this.maxPrice !== null && this.maxPrice > 0) {
      queryParams.max = this.maxPrice;
    } else {
      queryParams.max = null;
    }

    this.router.navigate(['/categorias'], {
      queryParams
    });

  }

  applyFilters() {
    let filtered = [...this.allProducts];

    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p =>
        this.selectedCategories.includes(p.category)
      );
    }

    if (this.searchBind) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(this.searchBind.toLowerCase())
      );
    }

    const minPrice = this.minPrice;
    const maxPrice = this.maxPrice;

    if (minPrice !== null) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    this.productList = filtered;
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

    const requests = categories.map(c =>
      this.productService.getProductsByCategory(c)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        this.allProducts = results.flat();
        this.applyFilters();
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
        this.allProducts = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        console.error('Erro ao carregar produtos: ', err);
      }
    });
  }

  getProductValue(products: Product[]) {
    if (products.length === 0) return;

    let maxPrice = products[0].price;
    let minPrice = products[0].price;

    for (let i = 1; i < products.length; i++) {
      if (products[i].price > maxPrice) {
        maxPrice = products[i].price;
      }

      if (products[i].price < minPrice) {
        minPrice = products[i].price;
      }
    }

    this.maxPrice = maxPrice;
    this.minPrice = minPrice;
  }

  onPriceChange() {
    if (this.minPrice !== null && this.minPrice < 0) {
      this.minPrice = null;
    }

    if (this.maxPrice !== null && this.maxPrice < 0) {
      this.maxPrice = null;
    }

    if (
      this.minPrice !== null &&
      this.maxPrice !== null &&
      this.minPrice > this.maxPrice
    ) {
      this.maxPrice = this.minPrice;
    }

    this.updateUrl();
    this.applyFilters();
  }

  // BANNER LOGIC

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.setBanner();
  }

  setBanner() {
    const device = this.isMobileView ? 'mobile' : 'desktop';
    let newPath = `assets/images/banner/${device}/banner-first.jpg`;

    if (this.selectedCategories.length === 1) {
      const category = this.selectedCategories[0];
      if (this.bannerMap[category]) {
        newPath = `${this.bannerMap[category]}/${device}.png`;
      }
    }

    if (this.bannerPath === newPath) return;

    this.bannerPath = newPath;

    requestAnimationFrame(() => {
      if (this.bannerImg) {
        this.renderer.removeClass(this.bannerImg.nativeElement, 'fading');
        requestAnimationFrame(() => {
          this.renderer.addClass(this.bannerImg.nativeElement, 'fading');
        });
      }
    });
  }

  onImageLoad() {
    if (this.bannerImg) {
      this.renderer.addClass(this.bannerImg.nativeElement, 'fading');
    }
  }

  ngOnDestroy() {
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
    }
  }
}
