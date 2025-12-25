import { Component, Input, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast/toast-service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart-service';
import { Product } from '../../interfaces/product/product';
import { ProductListItem } from '../../interfaces/product-list/product-list-item';
import { ProductService } from '../../services/product/product-service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})

export class ProductCard implements OnInit{
  @Input() product!: ProductListItem;

  constructor(private toast: ToastService,
    private router: Router,
    private cart: CartService,
    private productService: ProductService

  ) {

  }

  ngOnInit(): void {
    const favProducts = JSON.parse(
      localStorage.getItem('favProducts') || '[]'
    ) as { id: number }[];

    this.product.inList = favProducts.some(
      item => item.id === this.product.id
    );
  }

  viewProductDetails(id: number) {
    this.router.navigate(['/produto', id])
  }

  addToCart(product: ProductListItem) {
    this.productService.getProductById(product.id).subscribe({
      next: (fullProduct: Product) => {
        this.cart.addToCart(fullProduct);
        this.toast.showToast('Produto adicionado ao carrinho!', 'sucesso');
      },
      error: () => {
        this.toast.showToast('Erro ao adicionar ao carrinho', 'erro');
      }
    });
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
