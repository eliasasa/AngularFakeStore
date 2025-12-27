import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { ToastService } from '../../services/toast/toast-service';
import { CartItem } from '../../interfaces/cart/cart-itens';
import { ProductService } from '../../services/product/product-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {

  constructor (
    private cart: CartService,
    private toast: ToastService,
    private product: ProductService
  ) {}

  cartItems: CartItem[] = [];
  cartTotal: number = 0

  clearCart() {
    this.cart.cleanCart();
    this.toast.showToast('Carrinho limpo.', 'sucesso');
  }

  ngOnInit(): void {
    this.cartItems = this.cart.getCart();
    this.cartItems.forEach(p => {
      this.cartTotal += p.product.price*p.quantity
    });
  }

}
