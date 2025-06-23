import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private readonly API_URL = 'https://fakestoreapi.com';

  async signIn(username: string, password: string): Promise<any> {
  const credentials = { username: username.trim(), password: password.trim() };
  try {
    const response = await fetch(this.API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    
    const data = await response.json();
  
    if (data.token) {
      localStorage.setItem('token', data.token);

      const usersResponse = await fetch(this.API_URL + '/users');
      const users = await usersResponse.json();

      const user = users.find((u: any) => u.username === username);
      if (user) {
        localStorage.setItem('userId', user.id);
      }

      return true;
    }

    return false;
    
  } catch (error) {
    // console.error('Erro de autenticação:', error);
    return false;
  }
}

}
