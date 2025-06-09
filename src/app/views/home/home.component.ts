import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { EnviarFormService } from '../../services/enviar-form.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { Filter, FilterContent } from '../../components/filter/filter';
import { ProductCard } from '../../components/product-card/product-card';


@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    BannerComponent,
    Filter,
    ProductCard,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  filters: FilterContent[] = [
    { title: 'Categoria', value: 'categoria', materialIcon: 'category' },
    { title: 'Preço', value: 'preco', materialIcon: 'attach_money' },
    { title: 'Avaliação', value: 'avaliacao', materialIcon: 'star_rate' }
  ];


  @ViewChild('filterComp') filterComponent!: Filter;  

  getSelectedFilter() {
    return this.filterComponent?.getSelectedFilterValue();
  }

  ngAfterViewInit(): void {
    
  }

  x : string | null = null;

  teste () {
    this.x = this.getSelectedFilter();
    window.alert(this.x);
  }
  

}
