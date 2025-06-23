import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class User {
  constructor() { }
  private readonly API_URL = 'https://fakestoreapi.com';
  
  async getInfoUser(idUser: number | null): Promise<any> {
    if (!idUser) return [];

    try {
      const response = await fetch(`${this.API_URL}/users/${idUser}`);
      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return [];
    }
  }

}
