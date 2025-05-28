import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnviarFormService {

  constructor() { }

  enviaProBackend(dados: any) {
    console.log('Dados enviados para o backend:', dados);
    return dados;
    
  }

  logar(dados: any) {
    console.log('Dados de login:', dados);
    return dados;
  }

}
