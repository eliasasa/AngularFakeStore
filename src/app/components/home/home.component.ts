import { Component, inject } from '@angular/core';
import { EnviarFormService } from '../../services/enviar-form.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  nome = 'FakeStore';
  titulo = false;
  items = [
    { id: 1, nome: 'Produto 1', preco: 10.00 },
    { id: 2, nome: 'Produto 2', preco: 20.00 },
    { id: 3, nome: 'Produto 3', preco: 30.00 }
  ];

  private EnviarFormService = inject(EnviarFormService);
  dado!: any;

  imprimir ($event: any) {
    if ($event['type'] == 'click') {
      window.alert('Você clicou no botão!');
      this.dado = this.EnviarFormService.enviaProBackend($event);
      window.alert('Dados enviados: ' + this.dado['type']);
      if (this.titulo) {
        this.titulo = false;
      } else {
        this.titulo = true;
      } 
    }
  }

  logar ($event: any) {
    if ($event['type'] == 'click') {
      window.alert('Você clicou no botão de login!');
      this.dado = this.EnviarFormService.logar($event);
      window.alert('Dados de login: ' + this.dado['type']);
    }
  }
}
