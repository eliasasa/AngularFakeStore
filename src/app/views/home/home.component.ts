import { Component, inject } from '@angular/core';
import { EnviarFormService } from '../../services/enviar-form.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { FilterComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    BannerComponent,
    FilterComponent
    
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  enviarFormService = inject(EnviarFormService);
  
  constructor() {
    // You can initialize any properties or services here if needed
  }
  
  // Add any methods or properties specific to the HomeComponent here
}
