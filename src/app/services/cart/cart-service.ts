import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../interfaces/product/product';
import { CartItem } from '../../interfaces/cart/cart-itens';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'cartProducts';
  private isBrowser: boolean;

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const cart = this.loadCart();
      this.cartSubject.next(cart);
    }
  }

  private loadCart(): CartItem[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveCart(cart: CartItem[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  cleanCart(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(this.STORAGE_KEY);
    this.cartSubject.next([]);
  }


  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    if (!this.isBrowser) return;

    const cart = [...this.getCart()];
    const item = cart.find(i => i.product.id === product.id);

    if (item) {
      item.quantity += quantity;
    } else {
      cart.push({
        product,
        quantity
      });
    }

    this.saveCart(cart);
  }

  removeFromCart(productId: number): void {
    const cart = this.getCart().filter(
      i => i.product.id !== productId
    );
    this.saveCart(cart);
  }

  decreaseQuantity(productId: number): void {
    const cart = [...this.getCart()];
    const item = cart.find(i => i.product.id === productId);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.saveCart(cart);
    }
  }

}
