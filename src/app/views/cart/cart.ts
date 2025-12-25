import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { ToastService } from '../../services/toast/toast-service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {

  constructor (
    private cart: CartService,
    private toast: ToastService
  ) {}

  clearCart() {
    this.cart.cleanCart();
    this.toast.showToast('Carrinho limpo.', 'sucesso');
  }
}
