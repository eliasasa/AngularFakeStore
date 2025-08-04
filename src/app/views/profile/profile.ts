import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast-service';
import { User } from '../../services/user/user';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
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

  formatPhone(event: any) {
    const onlyDigits = this.dados.phone.replace(/\D/g, '');
    const trimmed = onlyDigits.slice(0, 11);

    const parts = [];
    const d = trimmed;

    if (d.length >= 1) parts.push(d.slice(0, 1));
    if (d.length >= 4) parts.push(d.slice(1, 4));
    if (d.length >= 7) parts.push(d.slice(4, 7));
    if (d.length >= 8) parts.push(d.slice(7));

    this.dados.phone = parts.join('-');
  }

  editarInfo() {
    const fname = (document.getElementById('fname') as HTMLInputElement).value;
    const lname = (document.getElementById('lname') as HTMLInputElement).value
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value
    const id = parseInt(this.idUser!, 10);
    const telefoneRegex = /^[0-9]-[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

    if (!fname || !lname || !username || !phone) {
      this.toastService.showToast('Nenhum dos campos deve estar vazio!', 'aviso');
      return;
    }

    if (!telefoneRegex.test(phone)) {
      this.toastService.showToast('Telefone inválido! Use o formato X-XXX-XXX-XXXX', 'erro');
      return;
    }

    this.userService.updateUser(id, {
      name: { firstname: fname, lastname: lname },
      username: username,
      phone: phone
    }).then(() => {
      this.toastService.showToast('Informações atualizadas com sucesso!', 'sucesso');
      this.toastService.showToast('Este sistema é apenas demonstrativo, nenhuma alteração real foi feita.', 'info');
    }).catch((error) => {
      console.error('Erro ao atualizar informações:', error);
      this.toastService.showToast('Erro ao atualizar informações', 'erro');
    });
  }

  mostrar1 = false;
  mostrar2 = false;

  async carregarDadosUsuario() {
    const id = parseInt(this.idUser!, 10);
    this.dados = await this.userService.getInfoUser(id);
  }

}
