import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';
import { RouterLink } from "@angular/router";
import { User } from '../../services/user/user';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastService } from '../../services/toast/toast-service';

@Component({
  selector: 'app-checkout',
  imports: [DecimalPipe, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {

  constructor (
    private cart: CartService,
    private auth: AuthService,
    private user: User,
    private fb: FormBuilder,
    private toast: ToastService,
  ) {}

  total: number = 0;
  currentStep: number = 0;
  isLogged: boolean = false
  private authSub!: Subscription;
  userData: any = null;

  personalForm!: FormGroup;
  addressForm!: FormGroup;
  paymentForm!: FormGroup;

  ngOnInit(): void {
    this.authSub = this.auth.isLoggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    if (this.isLogged) {
      this.total = this.cart.getCartTotal();
      const userId = Number(localStorage.getItem('userId'));

      if (userId > 0) {
        this.personalForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          cpf: ['', Validators.required],
          phone: ['', Validators.required],
        });

        this.addressForm = this.fb.group({
          cep: ['', Validators.required],
          address: ['', Validators.required],
          number: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
        });

        this.user.getInfoUser(userId).then(res => {
          this.userData = res;

          this.personalForm.patchValue({
            name: `${res.name.firstname} ${res.name.lastname}`,
            email: res.email,
            phone: res.phone,
          });

          this.addressForm.patchValue({
            cep: res.address.zipcode,
            address: res.address.street,
            number: res.address.number,
            city: res.address.city,
          });
        });

      }

    }

  }

  currentFormValid(): boolean {
    const form = this.getCurrentForm();

    if (!form) return false;

    if (form.invalid) {
      form.markAllAsTouched(); 
      this.toast.showToast('Alguns dados são obrigatórios!', 'erro')
      
      return false;
    }

    return true;
  }

  getCurrentForm() {
    if (this.currentStep === 0) return this.personalForm;
    if (this.currentStep === 1) return this.addressForm;
    if (this.currentStep === 2) return this.paymentForm;
    return null;
  }

  onNextStep() {
    if (!this.currentFormValid()) return;
    this.currentStep++;
  }

  decreaseStep() {
    if (this.currentStep === 0) {return}
    this.currentStep -= 1;
  }

}
