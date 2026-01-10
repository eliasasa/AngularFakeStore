import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';
import { RouterLink } from "@angular/router";
import { User } from '../../services/user/user';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastService } from '../../services/toast/toast-service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-checkout',
  imports: [DecimalPipe, CommonModule, RouterLink, ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
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
  currentStep: number = 2;
  isLogged: boolean = false
  private authSub!: Subscription;
  userData: any = null;
  isCvvFocused = false;

  personalForm!: FormGroup;
  addressForm!: FormGroup;
  paymentForm!: FormGroup;
  pixQrCode: string | null = null;

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
          phoneFix: ['']
        });

        this.addressForm = this.fb.group({
          cep: ['', Validators.required],
          address: ['', Validators.required],
          number: ['', Validators.required],
          bairro: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          frete: ['', Validators.required]
        });

        this.paymentForm = this.fb.group({
          paymentMethod: ['', Validators.required],

          cardNumber: [''],
          cardName: ['', Validators.maxLength(37)],
          cardExpiry: [''],
          cardCvv: [''],
          installments: ['1']
        });

        this.user.getInfoUser(userId).then(res => {
          this.userData = res;

          this.personalForm.patchValue({
            name: `${res.name.firstname} ${res.name.lastname}`,
            email: res.email,
            phoneFix: res.phone,
          });

          this.addressForm.patchValue({
            cep: res.address.zipcode,
            address: 'Rua ' + res.address.street,
            number: res.address.number,
            city: res.address.city,
          });
        });

        this.paymentForm.get('cardExpiry')?.valueChanges.subscribe(value => {
          const formatted = this.formatExpiration(value);
          this.paymentForm.get('cardExpiry')?.setValue(formatted, {
            emitEvent: false
          });
        });


      }

    }

  }
  
  get paymentMethod() {
    return this.paymentForm.get('paymentMethod')?.value;
  }

  generatePixQr() {
    this.pixQrCode =
      'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX-EXEMPLO';
  }

  formatCard(value: string): string {
    return value
      ?.replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  formatExpiration(value: string | number | null): string {
    if (!value) return '';

    let digits = String(value).replace(/\D/g, '');

    digits = digits.slice(0, 4);

    if (digits.length >= 2) {
      let month = parseInt(digits.slice(0, 2), 10);

      if (month === 0) month = 1;
      if (month > 12) month = 12;

      digits = month.toString().padStart(2, '0') + digits.slice(2);
    }

    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return digits;
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
