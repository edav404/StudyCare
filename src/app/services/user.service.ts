import { Injectable } from '@angular/core';

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private loggedUser: User | null = null;

  register(user: Omit<User, 'id'>): boolean {
    const exists = this.users.some(u => u.email === user.email);
    if (exists) return false;
    const newUser: User = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return true;
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.loggedUser = user;
      return true;
    }
    return false;
  }

  getLoggedUser(): User | null {
    return this.loggedUser;
  }

  updateUser(updated: User) {
    const index = this.users.findIndex(u => u.id === updated.id);
    if (index !== -1) {
      this.users[index] = updated;
      if (this.loggedUser?.id === updated.id) {
        this.loggedUser = updated;
      }
    }
  }

  logout() {
    this.loggedUser = null;
  }
}
