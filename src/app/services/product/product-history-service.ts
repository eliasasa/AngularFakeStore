import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductHistoryService {

  private readonly STORAGE_KEY = 'viewProducts';

  constructor() { 
    
  }

  getHistory(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  addProduct(product: any): void {
    const history = this.getHistory();

    const filtered = history.filter(p => p.id !== product.id);

    const updated = [product, ...filtered];

    const limited = updated.slice(0, 8);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  
}
