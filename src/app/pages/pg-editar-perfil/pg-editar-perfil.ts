import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-pg-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pg-editar-perfil.html',
  styleUrl: './pg-editar-perfil.css',
})
export class PgEditarPerfil implements OnInit {
  usuario: User | null = null;

  nombre: string = '';
  correo: string = '';
  password: string = '';
  mensaje: string = '';
  error: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.usuario = this.userService.getCurrentUser();

    if (!this.usuario) {
      // Si no hay usuario logueado, redirige al login
      this.router.navigate(['/login']);
      return;
    }

    // Cargar los datos del usuario actual
    this.nombre = this.usuario.nombre;
    this.correo = this.usuario.correo;
    this.password = this.usuario.password;
  }

  guardarCambios() {
    if (!this.nombre || !this.correo || !this.password) {
      this.mensaje = 'Todos los campos son obligatorios.';
      this.error = true;
      return;
    }

    const actualizado = this.userService.updateUser({
      nombre: this.nombre,
      correo: this.correo,
      password: this.password,
    });

    if (actualizado) {
      this.mensaje = 'Perfil actualizado correctamente ✅';
      this.error = false;
    } else {
      this.mensaje = 'Error al actualizar el perfil.';
      this.error = true;
    }
  }

  cerrarSesion() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
