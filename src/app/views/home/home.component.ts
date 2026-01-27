import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ProductService } from '../../services/product/product-service';
import { GlobalService } from '../../services/global/global-service';
import { Product } from '../../interfaces/product/product';
import { Subscription } from 'rxjs';
import { BannerComponent } from '../../components/banner/banner.component';
import { Filter } from '../../components/filter/filter';
import { ProductCard } from '../../components/product-card/product-card';
import { ToastService } from '../../services/toast/toast-service';
import { Load } from '../../components/load/load';
import { ProductList } from '../../components/product-list/product-list';
import { AdBannerComponent } from '../../components/ad-banner/ad-banner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    BannerComponent,
    Filter,
    ProductCard,
    Load,
    ProductList,
    AdBannerComponent
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  productsByRate: Product[] = [];
  productsByCount: Product[] = [];
  loading: boolean = false;
  error: boolean = false;
  filters: any[] = [
    { title: 'Todos', value: 'all', materialIcon: 'list' },
    { title: 'Eletrônicos', value: 'electronics', materialIcon: 'devices' },
    { title: 'Joias', value: 'jewelery', materialIcon: 'diamond' },
    { title: 'Masculino', value: "men's clothing", materialIcon: 'man' },
    { title: 'Feminino', value: "women's clothing", materialIcon: 'woman' }
  ];

  adBannerData = [
    {
      desktopImageUrl: '/assets/images/ad-banner/10588236.png',
      mobileImageUrl: '/assets/images/ad-banner/10588387.png',
      linkUrl: '/categorias',
    },
    {
      desktopImageUrl: '/assets/images/ad-banner/10564971.png',
      mobileImageUrl: '/assets/images/ad-banner/10564972.png',
      queryParams: { cat: 'jewelery' },
      linkUrl: '/categorias',
    }
  ];

  
  private categorySubscription!: Subscription;

  constructor(
    private productService: ProductService,
    public globalService: GlobalService
  ) {}

  toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadProducts(this.globalService.getSharedValue());
    for (let i = 0; i < this.filters.length; i++) {
      if (this.globalService.getSharedValue() === this.filters[i].value) {
        this.filters[i] = { ...this.filters[i], class: 'active' };
      }
    }

    // ele ouve quando o global muda
    this.categorySubscription = this.globalService.sharedValue$.subscribe(category => {
      this.loadProducts(category);
    });
  }

  ngOnDestroy(): void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

  loadProducts(category: string): void {
    this.loading = true;
    this.error = false;
    
    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.productsByRate = [...products].sort((a, b) => b.rating.rate - a.rating.rate).splice(0, 12);
        this.productsByCount = [...products].sort((a, b) => b.rating.count - a.rating.count).slice(0, 12)
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  

}