import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Definir la interfaz Task
export interface Task {
  id: string;
  title: string;
  category: 'fisico' | 'mental' | 'academico' | 'otro';
  completed: boolean;
}

@Component({
  selector: 'app-pg-inicio',
  imports: [CommonModule, FormsModule],
  templateUrl: './pg-inicio.html',
  styleUrl: './pg-inicio.css',
})
export class PgInicio {
  protected readonly title = signal('ng-tw-4-app');
  userName = 'Samuel';
  categories: Task['category'][] = ['academico', 'fisico', 'mental'];
  //colores por categoria
  categoryColors: Record<Task['category'], string> = {
    academico: 'blue',
    fisico: 'green',
    mental: 'purple',
    otro: 'gray',
  };
  //clases dinamicas por categoria
  getClass(category: Task['category']): any {
    const color = this.categoryColors[category];
    return {
      ['bg-' + color + '-100']: true,
      ['text-' + color + '-600']: true,
    };
  }
  //lista de tasks
  tasks: Task[] = [];

  //increment task completion
  addTask(title: string, category: Task['category']) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category,
      completed: false,
    };
    this.tasks.push(newTask);
  }

  //agrupar tasks por categoria
  get tasksByCategory(): Record<Task['category'], Task[]> {
    return this.tasks.reduce((acc, task) => {
      acc[task.category] = acc[task.category] || [];
      acc[task.category].push(task);
      return acc;
    }, {} as Record<Task['category'], Task[]>);
  }

  //calculate overall progress
  getProgressPercent(): number {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((task) => task.completed).length;
    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  }
  get progressPercent(): number {
    return this.getProgressPercent();
  }
  //dynamic progress message
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
