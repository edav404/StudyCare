import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { EditarPerfilSidebarComponent } from '../pg-editar-perfil/editar-perfil-sidebar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, EditarPerfilSidebarComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  showUserIcon = true;
  showSidebar = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const current = event.urlAfterRedirects;
        this.showUserIcon = !(current.includes('login') || current.includes('registrar'));
      }
    });
  }

  goHome() {
    this.router.navigate(['/inicio']);
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  closeSidebar() {
    this.showSidebar = false;
  }
}
