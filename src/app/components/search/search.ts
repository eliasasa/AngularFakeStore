import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product/product-service';
import { Product } from '../../interfaces/product/product';
import { filter } from 'rxjs';
import { Load } from '../load/load';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [Load],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  standalone: true,
})
export class Search implements AfterViewInit, OnDestroy {

  ngAfterViewInit(): void {
    this.animatePlaceholder();
  }

  searchProducts: Product[] = [];

  finalPlaceholder = 'Pesquisar produtos';
  placeHolderText = '';
  private searchTimer: any;
  encontrado: boolean = true;
  load: boolean = false;

  private placeholderInterval: any;

  ngOnDestroy(): void {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
  }

  
  constructor (
    private ngZone: NgZone,
    private prodtServ: ProductService,
    private router: Router
  ) {

  }
  
  clearList() {
     setTimeout(() => {
        this.searchProducts = [];
        this.encontrado = true;
      }, 100);
  }
  
  viewProductSearch(id: number) {
    this.router.navigate(['/produto', id])
  }

  getProductOnInput(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();

    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      if (!value) {
        this.searchProducts = [];
        this.load = false;
        return;
      }

      this.load = true;

      this.prodtServ.getAllProducts().subscribe({
        next: (data) => {
          this.searchProducts = data.filter(p =>
            p.title.toLowerCase().includes(value.toLowerCase())
          );
          this.encontrado = this.searchProducts.length > 0;
          this.load = false;
        },
        error: (err) => {
          console.error('Erro ao buscar produtos', err);
          this.searchProducts = [];
          this.encontrado = false;
          this.load = false;
          }
        });
      }, 300);

  }

  
  private animatePlaceholder(): void {
    this.placeHolderText = '';
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
      this.placeholderInterval = null;
    }

    for (let i = 0; i <= this.finalPlaceholder.length; i++) {
      setTimeout(() => {
        this.placeHolderText = this.finalPlaceholder.slice(
          0,
          i
        );

        if (i === this.finalPlaceholder.length) {
          let dotCount = 0;
          let direction = 1;
          const base = this.finalPlaceholder;

          this.ngZone.runOutsideAngular(() => {
            this.placeholderInterval = setInterval(() => {
              const dots = '.'.repeat(dotCount);
              this.ngZone.run(() => {
                this.placeHolderText = base + dots;
              });

              if (dotCount === 3) direction = -1;
              else if (dotCount === 0) direction = 1;

              dotCount += direction;
            }, 500);
          });
        }
      }, i * 100);
    }
  }

}
