import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart/cart-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'https://fakestoreapi.com';

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cart: CartService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn.next(!!localStorage.getItem('token'));
    }
  }

  async signIn(username: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!data.token) return false;

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', data.token);
      }

      this.loggedIn.next(true);
      return true;
    } catch {
      return false;
    }
  }

  async register(user: {
    email: string;
    username: string;
    password: string;
    name: { firstname: string; lastname: string };
    phone: string;
  }): Promise<boolean> {
    try {
      const res = await fetch(`${this.API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!res.ok) return false;

      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.cart.cleanCart();
    this.loggedIn.next(false);
  }
}
