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
  nombre = '';
  correo = '';
  password = '';
  mensaje = '';
  mensajeTitulo = '';
  error = false;
  mostrarModal = false;

  constructor(private userService: UserService, private router: Router) {}

  registrar() {
    const ok = this.userService.register({
      nombre: this.nombre,
      correo: this.correo,
      password: this.password,
    });

    this.mostrarModal = true;

    if (ok) {
      this.error = false;
      this.mensajeTitulo = '¡Registro exitoso!';
      this.mensaje = 'Estamos creando tu cuenta...';
      setTimeout(() => {
        this.cerrarModal();
        this.router.navigate(['/login']);
      }, 2500);
    } else {
      this.error = true;
      this.mensajeTitulo = 'Error de registro';
      this.mensaje = 'El correo electrónico ya está registrado.';
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
