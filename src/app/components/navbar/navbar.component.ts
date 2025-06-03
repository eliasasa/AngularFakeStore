import { Component, AfterViewInit, NgZone, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  finalPlaceholder = 'Pesquisar produtos';
  placeHolderText = '';
  isLoggedIn = false;
  userPhoto = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  userName = 'Usuário';

  @ViewChild(SidebarComponent) sidebarComponent!: SidebarComponent;

  private placeholderInterval: any;

  constructor(private ngZone: NgZone) {}

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
