import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../cart/cart-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'https://fakestoreapi.com';

  private loggedIn!: BehaviorSubject<boolean>;
  isLoggedIn$!: Observable<boolean>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cart: CartService,
  ) {
    const isBrowser = isPlatformBrowser(this.platformId);

    const token = isBrowser
      ? localStorage.getItem('token')
      : null;

    this.loggedIn = new BehaviorSubject<boolean>(!!token);
    this.isLoggedIn$ = this.loggedIn.asObservable();
  }

  async signIn(username: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });
      const data = await res.json();
      if (!data.token) {
        return false;
      }

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', data.token);
      }

      const usersRes = await fetch(`${this.API_URL}/users`);
      const users = await usersRes.json();
      const user = users.find((u: any) => u.username === username);
      if (user && isPlatformBrowser(this.platformId)) {
        localStorage.setItem('userId', String(user.id));
        localStorage.setItem('favProducts', JSON.stringify([]));
        localStorage.setItem('cartProducts', JSON.stringify([]));
        localStorage.setItem('viewProducts', JSON.stringify([]));
      }

      this.loggedIn.next(true);
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.cart.cleanCart()
    
    this.loggedIn.next(false);
  }
}
