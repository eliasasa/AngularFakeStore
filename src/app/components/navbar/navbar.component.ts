import { Component, AfterViewInit, NgZone, ViewChild} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule, Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  finalPlaceholder = 'Pesquisar produtos';
  placeHolderText = '';
  userPhoto = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  userName = 'Usuário';
  isLoggedIn = false;

  @ViewChild(SidebarComponent) sidebarComponent!: SidebarComponent;

  private placeholderInterval: any;
  private token: string | null = null;
  private idUser: string | null = null;

  constructor(
    private ngZone: NgZone, 
    private toastService: ToastService, 
    private router: Router
  ) {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      this.idUser = localStorage.getItem('userId');

      if (!this.token || !this.idUser) {
        this.toastService.showToast('Você não está logado', 'aviso');
        this.router.navigate(['/login']);
      } else {
        this.isLoggedIn = true;
      }
    }
  }

  ngAfterViewInit() {
    this.onLoad();
  }

  sidebarItems = [
    // Exemplo 1: usando imagem SVG
    { icon: 'assets/icons/navbar/search-icon.svg', text: 'Buscar', route: '/buscar' },
    // Exemplo 2: usando Material Icon (não define 'icon', mas define 'materialIcon')
    { materialIcon: 'analytics', text: 'Análise', route: '/analise' },
    // Exemplo 3: usando imagem SVG
    { icon: 'assets/icons/navbar/search-icon.svg', text: 'Produtos', route: '/produtos' },
    // Exemplo 4: usando Material Icon
    { materialIcon: 'contact_mail', text: 'Contato', route: '/contato' }
  ];

  toggleSidebarNavbar() {
    this.sidebarComponent.toggleSidebar(true);
    this.sidebarComponent.sidebarRenderContent(this.sidebarItems);
  }

  onLoad() {
    this.placeHolderText = "";

    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
      this.placeholderInterval = null;
    }

    for (let i = 0; i <= this.finalPlaceholder.length; i++) {
      setTimeout(() => {
        this.placeHolderText = this.finalPlaceholder.slice(0, i);

        if (i === this.finalPlaceholder.length) {
          let dotCount = 0;
          let direction = 1;
          const baseText = this.finalPlaceholder;

          this.ngZone.runOutsideAngular(() => {
            this.placeholderInterval = setInterval(() => {
              const dots = '.'.repeat(dotCount);
              this.ngZone.run(() => {
                this.placeHolderText = baseText + dots;
              });

              if (dotCount === 3) direction = -1;
              else if (dotCount === 0) direction = 1;

              dotCount += direction;
            }, 500);
          });
        }
      }, i * 100);
    }
  } 

  ngOnDestroy() {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
  }
}
