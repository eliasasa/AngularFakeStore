import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastMessage } from '../../interfaces/toast/toast-interface';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toastMessages$ = this.toastsSubject.asObservable();
  private nextId = 0;

  showToast(message: string, type: 'sucesso' | 'erro' | 'aviso' | 'info') {
    const newToast: ToastMessage = {
      id: this.nextId++,
      message,
      type,
      timestamp: Date.now()
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    setTimeout(() => {
      this.removeToast(newToast.id);
    }, 5000);
  }

  trackById(index: number, toast: ToastMessage): number {
    return toast.id;
  }

  removeToast(id: number) {
    const currentToasts = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(currentToasts);
  }

  removeAllToasts() {
    this.toastsSubject.next([]);
  }
}