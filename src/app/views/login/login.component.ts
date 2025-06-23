import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { ToastService } from '../../services/toast/toast-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router 
  ) {}

  async logar(event: Event) {
    event.preventDefault();
    
    if (!this.username || !this.password) {
      this.toastService.showToast('Preencha todos os campos', 'aviso');
      return;
    }

    const success = await this.authService.signIn(this.username, this.password);
    
    if (success) {
      this.toastService.showToast('Login realizado com sucesso!', 'sucesso');
      this.router.navigate(['/perfil']);
      // let token = localStorage.getItem('token');
      // this.toastService.showToast( token ? `Token: ${token}` : 'Token não criado', 'info');
      // this.router.navigate(['/']); // Redirecionar para home
    } else {
      this.toastService.showToast('Credenciais inválidas', 'erro');
      this.toastService.showToast('Exemplo de login: johnd, m38rmF$', 'info');
    }
  }

}
