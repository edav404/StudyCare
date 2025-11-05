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
  styleUrl: './pg-registrar.css',
})
export class PgRegistrar {
  nombre: string = '';
  correo: string = '';
  password: string = '';

  mensaje: string = '';
  error: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  registrar() {
    if (!this.nombre || !this.correo || !this.password) {
      this.mensaje = 'Por favor, complete todos los campos.';
      this.error = true;
      return;
    }

    const registrado = this.userService.register({
      nombre: this.nombre,
      correo: this.correo,
      password: this.password,
    });

    if (registrado) {
      this.mensaje = 'Registro exitoso 🎉 Redirigiendo al login...';
      this.error = false;
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } else {
      this.mensaje = 'Este correo ya está registrado.';
      this.error = true;
    }
  }
}
