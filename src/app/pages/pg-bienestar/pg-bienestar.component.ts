import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitCardComponent } from '../../components/habit-card/habit-card.component';

interface Habit {
  id: number;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
}

@Component({
  selector: 'app-pg-bienestar',
  standalone: true,
  imports: [CommonModule, HabitCardComponent],
  templateUrl: './pg-bienestar.component.html',
  styleUrls: ['./pg-bienestar.component.css']
})
export class PgBienestarComponent implements OnInit {
  habits: Habit[] = [];
  message: string = '';

  ngOnInit() {
    // Cargar desde localStorage o inicializar nuevos
    const savedHabits = localStorage.getItem('studycare_habits');
    this.habits = savedHabits
      ? JSON.parse(savedHabits)
      : [
          { id: 1, name: 'Beber agua', description: 'Toma al menos 8 vasos de agua al día.', icon: '💧', completed: false },
          { id: 2, name: 'Meditar', description: 'Dedica 5 minutos a respirar conscientemente.', icon: '🧘', completed: false },
          { id: 3, name: 'Ejercicio', description: 'Muévete al menos 15 minutos hoy.', icon: '🏃', completed: false },
          { id: 4, name: 'Dormir bien', description: 'Duerme mínimo 7 horas esta noche.', icon: '🌙', completed: false },
          { id: 5, name: 'Evitar pantallas', description: 'Desconéctate 30 minutos antes de dormir.', icon: '📵', completed: false }
        ];
    this.updateMessage();
  }

  toggleHabit(habit: Habit) {
    habit.completed = !habit.completed;
    localStorage.setItem('studycare_habits', JSON.stringify(this.habits));
    this.updateMessage();
  }

  get progress(): number {
    const done = this.habits.filter(h => h.completed).length;
    return Math.round((done / this.habits.length) * 100);
  }

  updateMessage() {
    const done = this.progress;
    if (done === 0) this.message = '¡Comienza tu día con energía!';
    else if (done < 50) this.message = 'Vas bien, sigue con tus hábitos 💪';
    else if (done < 100) this.message = '¡Excelente progreso! Estás cerca de cumplirlos todos 🌟';
    else this.message = '¡Felicidades! Completaste todos tus hábitos de hoy 🏆';
  }

  resetHabits() {
    this.habits.forEach(h => (h.completed = false));
    localStorage.setItem('studycare_habits', JSON.stringify(this.habits));
    this.updateMessage();
  }
}
