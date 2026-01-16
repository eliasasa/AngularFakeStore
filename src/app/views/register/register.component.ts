import { 
  Component, 
  ElementRef, 
  ViewChild, 
  AfterViewInit, 
  HostListener, 
  NgZone, 
  OnInit, 
  Inject, 
  PLATFORM_ID 
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast/toast-service';
import { AuthService } from '../../services/auth/auth-service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgxMaskDirective,
],
 providers: [
    provideNgxMask()
  ],
  styleUrls: ['./register.component.scss', '../login/login.component.scss']
})
export class RegisterComponent implements AfterViewInit, OnInit {
  
  @ViewChild('particleCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particlesArray: Particle[] = [];
  private numParticles = 100;
  formCadUser!: FormGroup;
  
  constructor(
    private fb : FormBuilder,
    private ngZone: NgZone, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private toast: ToastService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formCadUser = this.fb.group({
      step1: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', Validators.required]
      }),
      step2: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: ['', Validators.required]
      })
    });
  }

  currentStep = 0;
  stepTitles = ['Informações de Login', 'Dados Pessoais', 'Endereço'];
  

  isStepValid(step: number): boolean {
    if (step === 0) {
      return this.formCadUser.get('step1')!.valid;
    }

    if (step === 1) {
      return this.formCadUser.get('step2')!.valid;
    }

    return false;
  }

  nextStep() {
    if (!this.isStepValid(this.currentStep)) {
      this.markStepAsTouched(this.currentStep);
      this.toast.showToast('Preencha todos os dados!', 'aviso')
      return;
    }

    if (this.currentStep < 1) {
      this.currentStep++;
    }
  }


  prevStep() {
    if (this.currentStep > 0) this.currentStep--;
  }

  markStepAsTouched(step: number) {
    const group =
      step === 0
        ? this.formCadUser.get('step1')
        : this.formCadUser.get('step2');

    group?.markAllAsTouched();
  }

  onSubmit() {
    if (this.formCadUser.invalid) {
      this.formCadUser.markAllAsTouched();
      this.toast.showToast('Preencha todos os dados!', 'aviso')
      return;
    }

    const { step1, step2 } = this.formCadUser.value;

    const userData = {
      email: step1.email,
      username: step1.username,
      password: step1.password,
      name: {
        firstname: step2.firstName,
        lastname: step2.lastName
      },  
      phone: step2.phone
    };

    this.auth.register(userData).then(success => {
      if (success) {
        this.toast.showToast('Cadastro realizado com sucesso!', 'sucesso');
        this.toast.showToast('Cadastro apenas para fins de demonstração. Os dados não são armazenados.', 'info');
        this.router.navigate(['/login']);
      } else {
        this.toast.showToast('Erro ao cadastrar usuário', 'erro');
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const isBrowser = isPlatformBrowser(this.platformId) || (typeof window !== 'undefined' && !!window.document);
      if (!isBrowser) {
        console.warn("Canvas não será iniciado, pois não estamos no browser.");
        return;
      }

      if (!this.canvasRef) {
        console.error("Canvas não foi encontrado!");
        return;
      }

      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d')!;

      this.resizeCanvas();
      this.createParticles();

      this.ngZone.runOutsideAngular(() => {
        this.animate();
      });
    }, 50); 
  }

  @HostListener('window:resize')
  resizeCanvas(): void {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  createParticles(): void {
    this.particlesArray = [];
    for (let i = 0; i < this.numParticles; i++) {
      const size = Math.random() * 5 + 2;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const speedX = (Math.random() - 0.5) * 2;
      const speedY = (Math.random() - 0.5) * 2;
      this.particlesArray.push(new Particle(x, y, size, speedX, speedY));
    }
  }

  animate(): void {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particlesArray.forEach(particle => {
      particle.update(canvas);
      particle.draw(this.ctx);
    });

    requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(
    public x: number,
    public y: number,
    public size: number,
    public speedX: number,
    public speedY: number
  ) {}

  update(canvas: HTMLCanvasElement): void {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#BB86FC';
    ctx.fillStyle = "#BB86FC";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  
}
