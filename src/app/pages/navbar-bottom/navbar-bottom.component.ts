import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-bottom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-bottom.component.html',
  styleUrls: ['./navbar-bottom.component.css'],
})
export class NavbarBottomComponent {
  constructor(private router: Router) {}

  navItems = [
    { path: '/inicio', label: 'Inicio', icon: '🏠' },
    { path: '/estados-animo', label: 'Ánimo', icon: '😊' },
    { path: '/asignaturas', label: 'Asignaturas', icon: '📘' },
    { path: '/recursos', label: 'Recursos', icon: '📚' },
    { path: '/recordatorios', label: 'Recordatorios', icon: '⏰' },
  ];

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
