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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    BannerComponent,
    Filter,
    ProductCard,
    Load
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading: boolean = false;
  error: boolean = false;
  filters: any[] = [
    { title: 'Todos', value: 'all', materialIcon: 'list' },
    { title: 'Eletrônicos', value: 'electronics', materialIcon: 'devices' },
    { title: 'Joias', value: 'jewelery', materialIcon: 'diamond' },
    { title: 'Masculino', value: "men's clothing", materialIcon: 'man' },
    { title: 'Feminino', value: "women's clothing", materialIcon: 'woman' }
  ];
  
  private categorySubscription!: Subscription;

  constructor(
    private productService: ProductService,
    public globalService: GlobalService
  ) {}

  toastService = inject(ToastService);

  showError() {
    this.toastService.showToast('Ocorreu um erro!', 'erro');
  }

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
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }
}