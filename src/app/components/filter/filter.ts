import { Component, Input } from '@angular/core';
import { GlobalService } from '../../services/global/global-service';


export interface FilterContent {
  title: string;
  value: string;
  class?: string;
  materialIcon?: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {
  constructor(public globalService: GlobalService) {}
  @Input() filters: FilterContent[] = [];

  selectedFilter: string | null = null;

  onFilterClick(value: string) {
    // Remove a classe 'active' de todos os filtros
    const filtros = document.querySelectorAll('.filter-item') || [];
    filtros.forEach(elemento => elemento.classList.remove('active'));
    
    // Adiciona a classe apenas ao selecionado
    const selecionado = document.getElementById(value);
    selecionado?.classList.add('active');
    
    // Atualiza o valor no serviço global
    this.globalService.setSharedValue(value);
  }

  getSelectedFilterValue() {
    return this.selectedFilter;
  }

}
