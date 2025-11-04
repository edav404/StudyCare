import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  showUserIcon = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const current = event.urlAfterRedirects;
        this.showUserIcon = !(current.includes('login') || current.includes('registrar'));
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/editar-perfil']);
  }
}
