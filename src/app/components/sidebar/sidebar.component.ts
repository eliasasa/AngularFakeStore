import { Component, Input, ElementRef, HostListener } from '@angular/core';

interface SidebarItem {
    icon: string;
    text: string;
    route: string;
}

@Component({
  selector: 'app-sidebar',
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
                    const icon = document.createElement('img');
                    icon.src = conteudo[i].icon;
                    icon.alt = conteudo[i].text;
                    icon.classList.add('sidebar-icon');
                    const link = document.createElement('a');
                    link.href = conteudo[i].route;
                    link.textContent = conteudo[i].text;
                    item.appendChild(icon);
                    item.appendChild(link);
                    sidebarMenu.appendChild(item);
                }
            }
        }
    }
}
