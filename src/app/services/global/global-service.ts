import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private sharedValueSubject = new BehaviorSubject<string>('all');
  public sharedValue$ = this.sharedValueSubject.asObservable();

  setSharedValue(value: string): void {
    this.sharedValueSubject.next(value);
  }

  getSharedValue(): string {
    return this.sharedValueSubject.value;
  }
}