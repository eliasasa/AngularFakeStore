import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast-service';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private token: string | null;
  private idUser: string | null;
  dados: any = null;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private userService: User
  ) {
    this.token = localStorage.getItem('token');
    this.idUser = localStorage.getItem('userId');

    if (!this.token || !this.idUser) {
      this.toastService.showToast('Você não está logado', 'aviso');
      this.router.navigate(['/login']);
    } else {
      this.carregarDadosUsuario();
    }
  }

  async carregarDadosUsuario() {
    const id = parseInt(this.idUser!, 10);
    this.dados = await this.userService.getInfoUser(id);
  }

  deslogar() {
    localStorage.clear();
    this.toastService.showToast('Deslogado', 'sucesso');
    this.router.navigate(['/']);
  }
}
