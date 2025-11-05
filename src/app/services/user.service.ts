import { Injectable } from '@angular/core';

export interface User {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  rol_id: string;
  fechaRegistro: number;
  estado: 'activo' | 'inactivo';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    // Cargar usuarios y sesión del localStorage
    const storedUsers = localStorage.getItem('users');
    const storedSession = localStorage.getItem('currentUser');

    this.users = storedUsers ? JSON.parse(storedUsers) : [];
    this.currentUser = storedSession ? JSON.parse(storedSession) : null;
  }

  // 👉 Registrar un nuevo usuario
  register(newUser: Partial<User>): boolean {
    const exists = this.users.find(u => u.correo === newUser.correo);
    if (exists) return false; // Ya existe el correo

    const user: User = {
      id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
      nombre: newUser.nombre ?? '',
      correo: newUser.correo ?? '',
      password: newUser.password ?? '',
      rol_id: 'cliente',
      fechaRegistro: Date.now(),
      estado: 'activo',
    };

    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  // 👉 Iniciar sesión
  login(correo: string, password: string): boolean {
    const user = this.users.find(u => u.correo === correo && u.password === password && u.estado === 'activo');
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  // 👉 Cerrar sesión
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // 👉 Obtener el usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 👉 Saber si hay alguien logueado
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // 👉 Editar perfil (solo datos visibles del usuario)
  updateUser(updatedData: Partial<User>): boolean {
    if (!this.currentUser) return false;

    const index = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (index === -1) return false;

    this.users[index] = { ...this.users[index], ...updatedData };
    this.currentUser = this.users[index];

    // Guardar cambios en localStorage
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    return true;
  }
}
