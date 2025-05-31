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

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.onLoad();
  }

  sidebarItems = [
    { icon: 'assets/icons/navbar/search-icon.svg', text: 'Buscar', route: '/buscar' },
    { icon: 'assets/icons/navbar/search-icon.svg', text: 'Produtos', route: '/produtos' },
    { icon: 'assets/icons/navbar/search-icon.svg', text: 'Contato', route: '/contato' }
  ];

  toggleSidebarNavbar() {
    this.sidebarComponent.toggleSidebar(true);
    this.sidebarComponent.sidebarRenderContent(this.sidebarItems);
  }

  onLoad() {
    this.placeHolderText = "";

    for (let i = 0; i <= this.finalPlaceholder.length; i++) {
      setTimeout(() => {
        this.placeHolderText = this.finalPlaceholder.slice(0, i);

        if (i === this.finalPlaceholder.length) {
          let dotCount = 0;
          let direction = 1;
          const baseText = this.finalPlaceholder;

          this.ngZone.runOutsideAngular(() => {
            setInterval(() => {
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
}
