import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, HabitCardComponent],
  templateUrl: './pg-bienestar.component.html',
  styleUrls: []
})
export class PgBienestarComponent implements OnInit {
  habits: Habit[] = [];
  message: string = '';
  selectedHabit: Habit | null = null;
  showDetailModal = false;
  showCreateModal = false;

  newHabit: Partial<Habit> = { icon: '✨', name: '', description: '' };

  ngOnInit() {
    const saved = localStorage.getItem('studycare_habits');
    this.habits = saved ? JSON.parse(saved) : [];
    if (!this.habits || this.habits.length === 0) {
      this.habits = [
        { id: 1, name: 'Beber agua', description: 'Toma al menos 8 vasos de agua al día.', icon: '💧', completed: false },
        { id: 2, name: 'Meditar', description: 'Dedica 5 minutos a respirar conscientemente.', icon: '🧘', completed: false },
        { id: 3, name: 'Ejercicio', description: 'Muévete al menos 15 minutos hoy.', icon: '🏃', completed: false },
        { id: 4, name: 'Dormir bien', description: 'Duerme mínimo 7 horas esta noche.', icon: '🌙', completed: false }
      ];
      this.saveHabits();
    }
    this.updateMessage();
  }

  saveHabits() {
    localStorage.setItem('studycare_habits', JSON.stringify(this.habits));
    this.updateMessage();
  }

  get progress(): number {
    if (!this.habits || this.habits.length === 0) return 0;
    const done = this.habits.filter(h => h.completed).length;
    return Math.round((done / this.habits.length) * 100);
  }

  updateMessage() {
    const p = this.progress;
    if (p === 0) this.message = '¡Comienza tu día con energía!';
    else if (p < 50) this.message = 'Vas bien, sigue con tus hábitos 💪';
    else if (p < 100) this.message = '¡Excelente progreso! Estás cerca de cumplirlos todos 🌟';
    else this.message = '¡Felicidades! Completaste todos tus hábitos de hoy 🏆';
  }

  toggleHabit(habit: Habit) {
    const target = this.habits.find(h => h.id === habit.id);
    if (target) {
      target.completed = !target.completed;
      this.saveHabits();
    }
  }

  resetHabits() {
    this.habits.forEach(h => (h.completed = false));
    this.saveHabits();
  }

  openDetailModal(habit: Habit) {
    this.selectedHabit = { ...habit };
    this.showDetailModal = true;
  }

  closeModals() {
    this.showDetailModal = false;
    this.showCreateModal = false;
    this.selectedHabit = null;
    this.newHabit = { icon: '✨', name: '', description: '' };
  }

  toggleCompleted() {
    if (!this.selectedHabit) return;
    const target = this.habits.find(h => h.id === this.selectedHabit!.id);
    if (target) target.completed = !target.completed;
    this.saveHabits();
    this.closeModals();
  }

  deleteHabit() {
    if (!this.selectedHabit) return;
    this.habits = this.habits.filter(h => h.id !== this.selectedHabit!.id);
    this.saveHabits();
    this.closeModals();
  }

  updateHabit() {
    if (!this.selectedHabit) return;
    const index = this.habits.findIndex(h => h.id === this.selectedHabit!.id);
    if (index >= 0) this.habits[index] = this.selectedHabit!;
    this.saveHabits();
    this.closeModals();
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  createHabit() {
    if (!this.newHabit.name || !this.newHabit.description) return;
    const newId = this.habits.length ? Math.max(...this.habits.map(h => h.id)) + 1 : 1;
    const habit: Habit = {
      id: newId,
      name: this.newHabit.name!,
      description: this.newHabit.description!,
      icon: this.newHabit.icon || '✨',
      completed: false
    };
    this.habits.push(habit);
    this.saveHabits();
    this.closeModals();
  }
}
