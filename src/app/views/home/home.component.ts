import { Component} from '@angular/core';
import { EnviarFormService } from '../../services/enviar-form.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { Filter, FilterContent } from '../../components/filter/filter';

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    BannerComponent,
    Filter
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  filters: FilterContent[] = [
    { title: 'Categoria', value: 'categoria', materialIcon: 'category' },
    { title: 'Preço', value: 'preco', materialIcon: 'attach_money' },
    { title: 'Avaliação', value: 'avaliacao', materialIcon: 'star_rate' }
  ];
}
