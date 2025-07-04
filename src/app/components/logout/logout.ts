import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast-service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.scss'
})
export class Logout {
  constructor(
    private router: Router,
    private toastService: ToastService
  ) {
    localStorage.clear();
    this.toastService.showToast('Deslogado', 'sucesso');
    this.router.navigate(['/']);
  }
}
