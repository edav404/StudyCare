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
  styleUrl: './pg-login.css',
})
export class PgLogin {
  correo: string = '';
  password: string = '';
  mensaje: string = '';
  error: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  iniciarSesion() {
    if (!this.correo || !this.password) {
      this.mensaje = 'Por favor, ingrese su correo y contraseña.';
      this.error = true;
      return;
    }

    const logged = this.userService.login(this.correo, this.password);

    if (logged) {
      this.mensaje = 'Inicio de sesión exitoso ✅';
      this.error = false;
      setTimeout(() => this.router.navigate(['/inicio']), 1000);
    } else {
      this.mensaje = 'Correo o contraseña incorrectos, o usuario inactivo.';
      this.error = true;
    }
  }
}
