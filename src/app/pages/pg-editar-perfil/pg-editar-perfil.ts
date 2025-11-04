import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-pg-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pg-editar-perfil.html',
  styleUrl: './pg-editar-perfil.css'
})
export class PgEditarPerfil implements OnInit {
  user: User | null = null;
  mensaje = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getLoggedUser();
  }

  guardar() {
    if (this.user) {
      this.userService.updateUser(this.user);
      this.mensaje = 'Perfil actualizado correctamente';
    }
  }
}
