import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';
import { Router, RouterLink } from "@angular/router";
import { User } from '../../services/user/user';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastService } from '../../services/toast/toast-service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

type FreteTipo = 'PAC' | 'JADLOG' | 'SEDEX' | 'LOGGI';

@Component({
  selector: 'app-checkout',
  imports: [DecimalPipe, CommonModule, RouterLink, ReactiveFormsModule, NgxMaskDirective],
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
    private router: Router
  ) {}

  total: number = 0;

  FRETES: Record<FreteTipo, number> = {
    PAC: 19.90,
    JADLOG: 24.90,
    SEDEX: 29.90,
    LOGGI: 34.90
  };

  JUROS_MENSAL = 0.029;
  PARCELAS_SEM_JUROS = 3;

  currentStep: number = 0;
  isLogged: boolean = false
  private authSub!: Subscription;
  userData: any = null;
  isCvvFocused = false;
  boletoGerado = false;
  pixGerado = false;
  compraEfetuada = false;

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

        this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
          this.updatePaymentValidators(method);
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

  finalizarCompra() {
    this.paymentForm.markAllAsTouched();
    if (!this.currentFormValid()) return;

    if (this.compraEfetuada) {
      this.router.navigate(['/']);
      this.toast.showToast('Compra realizada com sucesso!', 'sucesso');
      this.cart.cleanCart();
      return;
    }

    if (this.paymentMethod === 'TICKET') {
      this.toast.showToast('Boleto gerado com sucesso!', 'sucesso');
      this.boletoGerado = true;
      this.compraEfetuada = true;
      return;
    }

    if (this.paymentMethod === 'PIX') {
      if (this.pixGerado) {
        this.compraEfetuada = true;
      } else {
        this.toast.showToast('Gere o QRCode antes de tentar finalizar a compra.', 'erro')
      }
      return;
    }

    if (this.paymentMethod === 'CREDIT' || this.paymentMethod === 'DEBIT') {
      this.toast.showToast('Compra realizada com sucesso!', 'sucesso');
      this.cart.cleanCart();
      this.router.navigate(['/']);
      return;
    }
  }

  openFakeBoleto() {
    window.open('assets/images/checkout/boleto.jpeg', '_blank');
  }

  get paymentMethod() {
    return this.paymentForm.get('paymentMethod')?.value;
  }

  updatePaymentValidators(method: string) {
    const cardControls = ['cardNumber', 'cardName', 'cardExpiry', 'cardCvv'];

    cardControls.forEach(control => {
      const field = this.paymentForm.get(control);

      field?.reset();

      field?.clearValidators();
    });

    if (method === 'CREDIT' || method === 'DEBIT') {
      this.paymentForm.get('cardNumber')?.setValidators([
        Validators.required,
        Validators.minLength(19)
      ]);

      this.paymentForm.get('cardName')?.setValidators([
        Validators.required,
        Validators.minLength(3)
      ]);

      this.paymentForm.get('cardExpiry')?.setValidators([
        Validators.required
      ]);

      this.paymentForm.get('cardCvv')?.setValidators([
        Validators.required,
        Validators.minLength(3)
      ]);
    }

    cardControls.forEach(control => {
      this.paymentForm.get(control)?.updateValueAndValidity();
    });

    this.paymentForm.updateValueAndValidity();
  }

  generatePixQr() {
    this.compraEfetuada = true;
    this.pixQrCode =
      'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' +
      encodeURIComponent('https://github.com/eliasasa');
  }

  formatCard(value: string): string {
    return value
      ?.replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  get freteValor(): number {
    const frete = this.addressForm.get('frete')?.value as FreteTipo | null;
    return frete ? this.FRETES[frete] : 0;
  }

  get parcelas(): number {
    return Number(this.paymentForm.get('installments')?.value ?? 1);
  }

  get valorParcela(): number {
    if (this.paymentMethod !== 'CREDIT') return 0;

    const base = this.valorFinal;

    if (this.parcelas <= this.PARCELAS_SEM_JUROS) {
      return Number((base / this.parcelas).toFixed(2));
    }

    const montante =
      base * Math.pow(1 + this.JUROS_MENSAL, this.parcelas);

    return Number((montante / this.parcelas).toFixed(2));
  }


  get valorFinal(): number {
    if (!this.addressForm) return this.total;

    let valor = this.total + this.freteValor;

    switch (this.paymentMethod) {
      case 'PIX':
        valor *= 0.95;
        break;

      case 'CREDIT':
        if (this.parcelas > this.PARCELAS_SEM_JUROS) {
          valor *= Math.pow(1 + this.JUROS_MENSAL, this.parcelas);
        }
        break;
    }

    return Number(valor.toFixed(2));
  }

  valorParcelaComJuros(parcelas: number): number {
    const total = this.total + this.freteValor;

    const montante =
      total * Math.pow(1 + this.JUROS_MENSAL, parcelas);

    return montante / parcelas;
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
