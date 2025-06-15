import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast/toast-service';
import { CommonModule } from '@angular/common';
import { ToastMessage } from '../../interfaces/toast/toast-interface';


@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ToastComponent {
  toastService = inject(ToastService);

  trackById(index: number, toast: ToastMessage): number {
    return toast.id;
  }
  
  closeToast(id: number) {
    this.toastService.removeToast(id);
  }
}