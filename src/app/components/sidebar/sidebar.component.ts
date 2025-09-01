import { Component, Input, ElementRef, HostListener } from '@angular/core';

interface SidebarItem {
    icon?: string;
    materialIcon?: string;
    text: string;
    route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isOpen = false;
    constructor(private elRef: ElementRef) {}

    toggleSidebar(open: boolean) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            if (open) {
                sidebar.classList.remove('sidebar-closed');
                sidebar.classList.add('sidebar-open');
                this.isOpen = true;
            } else {
                sidebar.classList.remove('sidebar-open');
                sidebar.classList.add('sidebar-closed');
                this.isOpen = false;
            }
        }
    }

    sidebarRenderContent(conteudo: SidebarItem[]) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const sidebarMenu = sidebar.querySelector('.sidebar-menu');
            if (sidebarMenu) {
                sidebarMenu.innerHTML = '';
                for (let i = 0; i < conteudo.length; i++) {
                    const item = document.createElement('li');
                    item.classList.add('sidebar-item');
                    item.style.cursor = 'pointer';
                    item.onclick = () => {
                        window.location.href = conteudo[i].route;
                    };

                    if (conteudo[i].icon) {
                        const icon = document.createElement('img');
                        icon.src = conteudo[i].icon as string;
                        icon.alt = conteudo[i].text;
                        icon.classList.add('sidebar-icon');
                        item.appendChild(icon);
                    } else if (conteudo[i].materialIcon) {
                        const span = document.createElement('span');
                        span.classList.add('material-icons');
                        span.classList.add('sidebar-icon');
                        span.textContent = conteudo[i].materialIcon as string;
                        item.appendChild(span);
                    }

                    const textSpan = document.createElement('span');
                    textSpan.textContent = conteudo[i].text;
                    item.appendChild(textSpan);

                    sidebarMenu.appendChild(item);
                }
            }
        }
    }
}
