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

  onFilterClick(value: string) {
    // Aqui você pode emitir um evento ou executar uma ação
    window.alert(`Filter clicked: ${value}`);
  }
}
