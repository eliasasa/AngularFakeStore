import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast-service';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private toastService: ToastService
  ) {
    
  }

  ngOnInit(): void {
    this.auth.logout();
    this.toastService.showToast('Deslogado', 'sucesso');
    this.router.navigate(['/']);
  }
}
