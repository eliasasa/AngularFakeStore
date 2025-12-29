import { booleanAttribute, Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { ToastService } from '../../services/toast/toast-service';
import { CartItem } from '../../interfaces/cart/cart-itens';
import { ProductService } from '../../services/product/product-service';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from "@angular/forms";
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink,
    CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})

export class Cart implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];
  cartTotal = 0;
  isLogged: boolean = false;

  private cartSub!: Subscription;
  private authSub!: Subscription;

  constructor(
    private cart: CartService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {

    this.authSub = this.auth.isLoggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    this.cartSub = this.cart.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.cartTotal = this.calculateTotal(cart);
    });
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }

  clearCart() {
    this.cart.cleanCart();
    this.toast.showToast('Carrinho limpo.', 'sucesso');
  }

  removeItem(id: number) {
    this.cart.removeFromCart(id);
    this.toast.showToast('Produto removido', 'sucesso');
  }

  addQuantity(item: CartItem) {
    this.cart.addToCart(item.product, 1);
  }

  decreaseQuantity(id: number){
    this.cartItems.forEach(p => {
      if (p.product.id === id) {
        if (p.quantity === 1) {
          return
        }
        this.cart.decreaseQuantity(id)
      }
    });
  }
  private calculateTotal(cart: CartItem[]): number {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}
