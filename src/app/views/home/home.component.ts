import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product/product-service';
import { GlobalService } from '../../services/global/global-service';
import { Product } from '../../models/product/product';
import { Subscription } from 'rxjs';
import { BannerComponent } from '../../components/banner/banner.component';
import { Filter } from '../../components/filter/filter';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    BannerComponent,
    Filter,
    ProductCard
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

  ngOnInit(): void {
    this.loadProducts('all');
    
    // Inscreva-se nas mudanças de categoria
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