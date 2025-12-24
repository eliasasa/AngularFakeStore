import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastService } from '../../services/toast/toast-service';
import { User } from '../../services/user/user';
import { AuthService } from '../../services/auth/auth-service';
import { Search } from '../search/search';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SidebarComponent, RouterModule, Search],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent
  implements OnInit, OnDestroy
{
  userPhoto =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  isLoggedIn = false;
  username: string | null = null;

  @ViewChild(SidebarComponent)
  sidebarComponent!: SidebarComponent;

  sidebarItems: any[] = [];

  private authSub = new Subscription();

  constructor(
    private auth: AuthService,
    private userService: User,
    private toastService: ToastService,
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

  ngOnDestroy(): void {

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

  
}
