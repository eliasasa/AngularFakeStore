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

  async updateUser(id: number, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return null;
    }
  }

}
