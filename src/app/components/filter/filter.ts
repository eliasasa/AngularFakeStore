import { Component, Input } from '@angular/core';

export interface FilterContent {
  title: string;
  value: string;
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
  @Input() filters: FilterContent[] = [];

  selectedFilter: string | null = null;

  onFilterClick(value: string) {
    this.selectedFilter = value;
    const filtros = document.querySelectorAll('.filter-item') || [];
    const selecionado = document.getElementById(value);
    filtros.forEach(elemento => {
      if (elemento.classList.contains('active')) {
        elemento.classList.remove('active');
      }
    });
    selecionado?.classList.add('active');
  }

  getSelectedFilterValue() {
    return this.selectedFilter;
  }

}
