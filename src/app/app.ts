import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './pages/navbar/navbar';
import { NavbarBottomComponent } from './pages/navbar-bottom/navbar-bottom.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, NavbarBottomComponent, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  constructor(public router: Router) {}

  shouldShowNavbarBottom(): boolean {
    const hiddenRoutes = ['/login', '/registrar'];
    return !hiddenRoutes.includes(this.router.url);
  }
}
