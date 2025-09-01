import { Component, Input, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast/toast-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard implements OnInit{
    @Input() product!: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    inList?: boolean;
  };

  constructor(private toast: ToastService,
    private router: Router
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

  addToCart(id: number) {
    window.alert(`Produto carrinho: ${id}`)
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
