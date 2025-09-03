import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast-service';
import { User } from '../../services/user/user';
import { FormsModule, NgModel } from '@angular/forms';
import { ProductList } from '../../components/product-list/product-list';
import { Load } from '../../components/load/load';
import { Product } from '../../interfaces/product/product';
import { ProductHistoryService } from '../../services/product/product-history-service';
import { ProductService } from '../../services/product/product-service';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule, 
    ProductList,
    Load
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private token: string | null;
  private idUser: string | null;
  dados: any = null;
  load: boolean = true;
  public viewedProduct: any[] = [];
  public favoriteProducts: any[] = [];

  constructor(
    private router: Router,
    private toastService: ToastService,
    private userService: User,
    private prodHist: ProductHistoryService
  ) {
    this.token = localStorage.getItem('token');
    this.idUser = localStorage.getItem('userId');

    if (!this.token || !this.idUser) {
      this.toastService.showToast('Você não está logado', 'aviso');
      this.router.navigate(['/login']);
    } else {
      this.favoriteProducts = JSON.parse(localStorage.getItem('favProducts') || '[]');
      this.viewedProduct = prodHist.getHistory();
      this.carregarDadosUsuario();
    }

    
    
  }

  formatZip(event: any) {
    const inputValue = event.target.value;
    const onlyDigits = inputValue.replace(/\D/g, '').slice(0, 9); // máximo 9 dígitos

    let formatted = '';
    if (onlyDigits.length <= 5) {
      formatted = onlyDigits;
    } else {
      formatted = `${onlyDigits.slice(0, 5)}-${onlyDigits.slice(5)}`;
    }

    this.dados.address.zipcode = formatted;
    event.target.value = formatted; // atualiza o input
  }

  onlyNum(event: any) {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 11);
  }


  formatPhone(event: any) {
    const inputValue = event.target.value;

    const onlyDigits = inputValue.replace(/\D/g, '').slice(0, 11);

    let formatted = '';

    if (onlyDigits.length <= 1) {
      formatted = onlyDigits;
    } else if (onlyDigits.length <= 4) {
      formatted = `${onlyDigits.slice(0, 1)}-${onlyDigits.slice(1)}`;
    } else if (onlyDigits.length <= 7) {
      formatted = `${onlyDigits.slice(0, 1)}-${onlyDigits.slice(1, 4)}-${onlyDigits.slice(4)}`;
    } else {
      formatted = `${onlyDigits.slice(0, 1)}-${onlyDigits.slice(1, 4)}-${onlyDigits.slice(4, 7)}-${onlyDigits.slice(7)}`;
    }

    this.dados.phone = formatted;
    event.target.value = formatted;
  }

  editarInfo() {
    const id = parseInt(this.idUser!, 10);

    const fname = (document.getElementById('fname') as HTMLInputElement).value;
    const lname = (document.getElementById('lname') as HTMLInputElement).value
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value
    const telefoneRegex = /^[0-9]-[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

    const city = (document.getElementById('city') as HTMLInputElement).value;
    const street = (document.getElementById('street') as HTMLInputElement).value;
    const number = (document.getElementById('number') as HTMLInputElement).value;
    const zipcode = (document.getElementById('zipcode') as HTMLInputElement).value;
    const cepRegex = /^\d{5}-\d{4}$/;

    if (!fname || !lname || !username || !phone) {
      this.toastService.showToast('Nenhum dos campos deve estar vazio!', 'aviso');
      return;
    }

    if (!telefoneRegex.test(phone)) {
      this.toastService.showToast('Telefone inválido! Use o formato X-XXX-XXX-XXXX', 'erro');
      return;
    }

    if (!cepRegex.test(zipcode)) {
      this.toastService.showToast('CEP inválido! Use o formato XXXXX-XXXX', 'erro');
      return;
    }


    if (!city || !street || !number || !zipcode) {
      this.toastService.showToast('Nenhum dos campos deve estar vazio!', 'aviso');
      return
    }

    this.userService.updateUser(id, {
      name: { firstname: fname, lastname: lname },
      username: username,
      phone: phone,
      city: city,
      street: street,
      number: number,
      zipcode: zipcode
    }).then(() => {
      this.toastService.showToast('Informações atualizadas com sucesso!', 'sucesso');
      this.toastService.showToast('Este sistema é apenas demonstrativo, nenhuma alteração real foi feita.', 'info');
    }).catch((error) => {
      console.error('Erro ao atualizar informações:', error);
      this.toastService.showToast('Erro ao atualizar informações', 'erro');
    });
  }

  mostrar1 : boolean = false;
  mostrar2 : boolean = false;

  async carregarDadosUsuario() {
    const id = parseInt(this.idUser!, 10);
    this.dados = await this.userService.getInfoUser(id);
    this.load = false;
  }

}
