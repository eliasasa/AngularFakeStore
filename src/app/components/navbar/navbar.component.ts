import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastService } from '../../services/toast/toast-service';
import { User } from '../../services/user/user';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  finalPlaceholder = 'Pesquisar produtos';
  placeHolderText = '';
  userPhoto =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  isLoggedIn = false;
  username: string | null = null;

  @ViewChild(SidebarComponent)
  sidebarComponent!: SidebarComponent;

  sidebarItems: any[] = [];

  private placeholderInterval: any;
  private authSub = new Subscription();

  constructor(
    private auth: AuthService,
    private userService: User,
    private toastService: ToastService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.buildSidebarItems();
    this.authSub = this.auth.isLoggedIn$.subscribe(
      async (logged) => {
        this.isLoggedIn = logged;
        this.buildSidebarItems();

        if (logged) {
          const id = localStorage.getItem('userId')!;
          try {
            const dados = await this.userService.getInfoUser(
              +id
            );
            this.username = '@' + dados.username;
          } catch {
            this.toastService.showToast(
              'Erro ao obter informações do usuário',
              'erro'
            );
          }
        } else {
          this.username = null;
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.animatePlaceholder();
  }

  ngOnDestroy(): void {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }

    this.authSub.unsubscribe();
  }

  toggleSidebarNavbar(): void {
    this.sidebarComponent.toggleSidebar(true);
    this.sidebarComponent.sidebarRenderContent(
      this.sidebarItems
    );
  }

  private buildSidebarItems(): void {
    const baseItems = [
      {
        icon: 'assets/icons/navbar/search-icon.svg',
        text: 'Buscar',
        route: '/buscar'
      },
      {
        materialIcon: 'analytics',
        text: 'Análise',
        route: '/analise'
      },
      {
        icon: 'assets/icons/navbar/search-icon.svg',
        text: 'Produtos',
        route: '/produtos'
      }
    ];

    if (this.isLoggedIn) {
      baseItems.push({
        materialIcon: 'logout',
        text: 'Deslogar',
        route: '/logout'
      });
    }

    this.sidebarItems = baseItems;
  }

  private animatePlaceholder(): void {
    this.placeHolderText = '';
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
      this.placeholderInterval = null;
    }

    for (let i = 0; i <= this.finalPlaceholder.length; i++) {
      setTimeout(() => {
        this.placeHolderText = this.finalPlaceholder.slice(
          0,
          i
        );

        if (i === this.finalPlaceholder.length) {
          let dotCount = 0;
          let direction = 1;
          const base = this.finalPlaceholder;

          this.ngZone.runOutsideAngular(() => {
            this.placeholderInterval = setInterval(() => {
              const dots = '.'.repeat(dotCount);
              this.ngZone.run(() => {
                this.placeHolderText = base + dots;
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
