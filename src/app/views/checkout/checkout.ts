import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-checkout',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements AfterViewInit {

  constructor (
    private cart: CartService,
    private auth: AuthService
  ) {}

  total: number = 0;
  currentStep: number = 0;
  isLogged: boolean = false
  private authSub!: Subscription;

  ngAfterViewInit(): void {
    this.total = this.cart.getCartTotal();

    this.authSub = this.auth.isLoggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

  }

  addStep() {
    if (this.currentStep === 2) {
      this.currentStep = 0;
      return
    }
    this.currentStep += 1
  }

}
