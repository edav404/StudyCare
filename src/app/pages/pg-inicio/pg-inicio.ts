import { Component, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-pg-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pg-inicio.html',
  styleUrl: './pg-inicio.css',
})
export class PgInicio implements OnInit {
  protected readonly title = signal('ng-tw-4-app');
  userName = '';
  categories = [
    { name: 'Académico', completed: 0, total: 5, color: 'blue' },
    { name: 'Físico', completed: 0, total: 5, color: 'green' },
    { name: 'Mental', completed: 0, total: 5, color: 'purple' },
  ];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();

    if (user) {
      this.userName = user.nombre;
    } else {
      this.router.navigate(['/login']);
    }
  }

  getClass(color: string): any {
    return {
      ['bg-' + color + '-100']: true,
      ['text-' + color + '-600']: true,
    };
  }

  addTask(cat: any) {
    if (cat.completed < cat.total) {
      cat.completed++;
    }
  }

  getProgressPercent(): number {
    const totalTasks = this.categories.reduce((sum, cat) => sum + cat.total, 0);
    const completedTasks = this.categories.reduce((sum, cat) => sum + cat.completed, 0);
    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  }

  get progressPercent(): number {
    return this.getProgressPercent();
  }

  getProgressMessage(): string {
    const percent = this.getProgressPercent();

    if (percent === 100) {
      return '¡Excelente trabajo, día completado!';
    } else if (percent >= 70) {
      return '¡Casi lo logras, no te detengas!';
    } else if (percent >= 31) {
      return '¡Sigue así, vas por buen camino!';
    } else {
      return '¡Vamos, apenas estás empezando!';
    }
  }
}
