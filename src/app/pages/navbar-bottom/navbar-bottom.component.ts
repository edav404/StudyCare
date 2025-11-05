import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-bottom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-bottom.component.html',
  styleUrls: ['./navbar-bottom.component.css']
})
export class NavbarBottomComponent {
  navItems = [
    { path: '/inicio', label: 'Inicio', icon: '🏠' },
    { path: '/estados-animo', label: 'Ánimo', icon: '😊' },
    { path: '/bienestar', label: 'Bienestar', icon: '💪' },
    { path: '/recursos', label: 'Recursos', icon: '📚' }
  ];
}
