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
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    RouterLink, 
    FormsModule
  ],
  styleUrls: ['./register.component.scss', '../login/login.component.scss']
})
export class RegisterComponent implements AfterViewInit, OnInit {
  
  @ViewChild('particleCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particlesArray: Particle[] = [];
  private numParticles = 100;
  
  constructor(private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}
  

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

  currentStep = 0;
  stepTitles = ['Informações de Login', 'Dados Pessoais', 'Endereço'];
  
  userData: any = {
    email: '',
    username: '',
    password: '',
    name: {
      firstname: '',
      lastname: ''
    },
    address: {
      city: '',
      street: '',
      number: '',
      zipcode: ''
    },
    phone: ''
  };

  nextStep() {
    if (this.currentStep < 2) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 0) this.currentStep--;
  }

  onSubmit() {
    console.log('Dados enviados:', this.userData);
    // Aqui você faria a chamada para a API FakeStore:
    // this.authService.register(this.userData).subscribe(...)
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
