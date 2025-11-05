import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

// Definir la interfaz Task
export interface Task {
  id: string;
  title: string;
  category: 'academico' | 'fisico' | 'mental';
  completed: boolean;
}

@Component({
  selector: 'app-pg-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pg-inicio.html',
  styleUrl: './pg-inicio.css',
})
export class PgInicio implements OnInit {
  protected readonly title = signal('ng-tw-4-app');
  userName = '';

  readonly categories = ['academico', 'fisico', 'mental'] as const;

  newTaskTitle = '';
  newTaskCategory: Task['category'] = 'academico';

  tasks: Task[] = [];

  // Colores por categoría
  categoryColors: Record<Task['category'], string> = {
    academico: 'blue',
    fisico: 'green',
    mental: 'purple',
  };

  constructor(private userService: UserService, private router: Router) {}

  // 🔹 Cargar usuario y tareas al iniciar
  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.userName = user.nombre;
    } else {
      this.router.navigate(['/login']);
    }

    this.loadTasksFromLocalStorage();
  }

  // 🔹 Clases dinámicas según categoría
  getClass(category: Task['category']): any {
    const color = this.categoryColors[category];
    return {
      ['bg-' + color + '-100']: true,
      ['text-' + color + '-600']: true,
    };
  }

  // 🔹 Añadir tarea
  addTask(title: string, category: Task['category']) {
    if (!title.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category,
      completed: false,
    };
    this.tasks.push(newTask);
    this.saveTasksToLocalStorage();
    this.newTaskTitle = '';
  }

  // 🔹 Guardar en localStorage
  saveTasksToLocalStorage(): void {
    localStorage.setItem('studycare_tasks', JSON.stringify(this.tasks));
  }

  // 🔹 Cargar desde localStorage
  loadTasksFromLocalStorage(): void {
    const stored = localStorage.getItem('studycare_tasks');
    if (stored) {
      this.tasks = JSON.parse(stored);
    }
  }

  // 🔹 Agrupar tareas por categoría
  get tasksByCategory(): Record<string, Task[]> {
    return this.tasks.reduce((acc, task) => {
      acc[task.category] = acc[task.category] || [];
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }

  // 🔹 Calcular progreso total
  getProgressPercent(): number {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((t) => t.completed).length;
    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  }

  get progressPercent(): number {
    return this.getProgressPercent();
  }

  // 🔹 Mensaje dinámico de progreso
  getProgressMessage(): string {
    const percent = this.getProgressPercent();
    if (percent === 100) return '¡Excelente trabajo, día completado!';
    if (percent >= 70) return '¡Casi lo logras, no te detengas!';
    if (percent >= 31) return '¡Sigue así, vas por buen camino!';
    return '¡Vamos, apenas estás empezando!';
  }
}
