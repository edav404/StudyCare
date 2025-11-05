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
  correo = '';
  password = '';
  mostrarModal = false;
  mensajeTitulo = '';
  mensaje = '';
  error = false;
  constructor(private userService: UserService, private router: Router) {}

  iniciarSesion() {
    this.mostrarModal = true;
    if (!this.correo || !this.password) {
      this.mensaje = 'Por favor, ingrese su correo y contraseña.';
      this.error = true;
      return;
    }

    const logged = this.userService.login(this.correo, this.password);

    this.error = false;
    this.mensajeTitulo = 'Verificando credenciales...';
    this.mensaje = 'Por favor espera mientras validamos tu sesión.';


    // Simulación asincrónica
    setTimeout(() => {
      if (logged) {
        this.mensajeTitulo = 'Inicio de sesión exitoso';
        this.mensaje = '¡Bienvenido de nuevo!';
        this.router.navigate(['/inicio'])
      } else {
        this.error = true;
        this.mensajeTitulo = 'Error de inicio de sesión';
        this.mensaje = 'Correo o contraseña incorrectos.';
      }
    }, 1500);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
