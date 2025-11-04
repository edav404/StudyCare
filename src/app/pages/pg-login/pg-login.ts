import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-pg-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pg-login.html',
  styleUrl: './pg-login.css'
})
export class PgLogin {
  email = '';
  password = '';
  mensaje = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    const ok = this.userService.login(this.email, this.password);
    if (ok) {
      this.router.navigate(['/editar-perfil']);
    } else {
      this.mensaje = 'Correo o contraseña incorrectos';
    }
  }
}
