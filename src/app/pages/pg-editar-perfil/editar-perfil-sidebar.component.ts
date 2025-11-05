import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-editar-perfil-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil-sidebar.component.html',
})
export class EditarPerfilSidebarComponent {
  @Output() cerrar = new EventEmitter<void>();

  nombre = '';
  correo = '';
  password = '';
  mensaje = '';
  error = false;

  constructor(private userService: UserService) {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.nombre = user.nombre;
      this.correo = user.correo;
      this.password = user.password;
    }
  }

  guardarCambios() {
    const actualizado = this.userService.updateUser({
      nombre: this.nombre,
      correo: this.correo,
      password: this.password,
    });

    if (actualizado) {
      this.mensaje = 'Datos actualizados correctamente';
      this.error = false;
    } else {
      this.mensaje = 'Error al actualizar los datos';
      this.error = true;
    }
  }

  cerrarSesion() {
    this.userService.logout();
    this.cerrar.emit();
    location.reload();
  }
}
