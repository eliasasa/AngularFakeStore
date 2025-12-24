import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product-service';
import { ToastService } from '../../services/toast/toast-service';
import { CommonModule } from '@angular/common';
import { Load } from '../../components/load/load';
import { ProductHistoryService } from '../../services/product/product-history-service';
import { Product } from '../../interfaces/product/product';


@Component({
  selector: 'app-products',
  imports: [CommonModule,
    Load,    
  ],
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  produto: any;

  load: boolean = true;
  success: boolean = false;
  isFavorited: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private toast: ToastService,
    private prodHis: ProductHistoryService
  ) {
    
  }

  returnHome() {
    this.router.navigate(['/'])
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id || isNaN(Number(id))) {
        this.toast.showToast('Parâmetro inválido.', 'erro')
        this.router.navigate(['/']);
        return;
      }

      const idNum = parseInt(id, 10);
      this.load = true;
      this.success = false;

      this.productService.getProductById(idNum).subscribe({
        next: (product: Product) => {
          if (!product || Object.keys(product).length === 0) {
            this.load = false;
            this.success = false;
            this.toast.showToast('Produto não encontrado.', 'erro');
            return;
          }

          this.produto = product;
          this.load = false;
          this.success = true;

          const stored = localStorage.getItem('favProducts');
          const favProducts: any[] = stored ? JSON.parse(stored) : [];

          this.isFavorited = favProducts.some((item) => item.id === this.produto.id);

          if (localStorage.getItem('userId')) {
            this.prodHis.addProduct(product);
          }
        },
        error: (err) => {
          this.load = false;
          this.success = false;
          this.toast.showToast(`Erro ao encontrar produto: ${err}`, 'erro');
        }
      });
    });
  }


  getStarIcons(rate: number): ('full' | 'half' | 'empty')[] {
    const rounded = Math.floor(rate * 2) / 2;
    const stars: ('full' | 'half' | 'empty')[] = [];

    for (let i = 1; i <= 5; i++) {
      if (rounded >= i) {
        stars.push('full');
      } else if (rounded + 0.5 === i) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }

    return stars;
  }

  toggleFavorite(product: any) {
    const stored = localStorage.getItem('favProducts');

    if (!localStorage.getItem('userId')) {
      this.toast.showToast('Você tem que estar logado para favoritar um produto!', 'aviso');
      return
    }

    let favProducts: any[] = stored ? JSON.parse(stored) : [];

    const exists = favProducts.some((item) => item.id === product.id);

    if (exists) {
      favProducts = favProducts.filter((item) => item.id !== product.id);
    } else {
      favProducts.push({...product, inList: true});
    }

    localStorage.setItem('favProducts', JSON.stringify(favProducts));
  }

}
