import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';
import { RouterLink } from "@angular/router";
import { User } from '../../services/user/user';

@Component({
  selector: 'app-checkout',
  imports: [DecimalPipe, CommonModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {

  constructor (
    private cart: CartService,
    private auth: AuthService,
    private user: User
  ) {}

  total: number = 0;
  currentStep: number = 0;
  isLogged: boolean = false
  private authSub!: Subscription;
  private userData: any = null ;

  ngOnInit(): void {
    this.authSub = this.auth.isLoggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    if (this.isLogged) {
      this.total = this.cart.getCartTotal();
      const userId = Number(localStorage.getItem('userId'));

      if (userId > 0) {
        this.userData = this.user.getInfoUser(userId);
      }
    }

  }

  addStep() {
    if (this.currentStep === 2) {
      return
    }
    this.currentStep += 1
  }

  decreaseStep() {
    if (this.currentStep === 0) {return}
    this.currentStep -= 1;
  }

}
