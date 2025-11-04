import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-pg-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pg-registrar.html',
  styleUrl: './pg-registrar.css'
})
export class PgRegistrar {
  nombre = '';
  email = '';
  password = '';
  mensaje = '';

  constructor(private userService: UserService, private router: Router) {}

  registrar() {
    const exito = this.userService.register({
      nombre: this.nombre,
      email: this.email,
      password: this.password
    });

    if (exito) {
      this.mensaje = 'Registro exitoso. Inicia sesión.';
      setTimeout(() => this.router.navigate(['/login']), 1000);
    } else {
      this.mensaje = 'Este correo ya está registrado.';
    }
  }
}
