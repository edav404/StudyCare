import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HabitCardComponent } from '../../components/habit-card/habit-card.component';

interface Tip {
  iconPath: string;
  title: string;
  description: string;
}

interface Habit {
  id: number;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
}

type Mood = 'Terrible' | 'Mal' | 'Normal' | 'Bien' | 'Genial';

@Component({
  selector: 'app-pg-bienestar-y-animo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HabitCardComponent],
  templateUrl: './pg-estados-animo.html',
  styleUrls: ['./pg-estados-animo.css'],
})
export class PgEstadosAnimo implements OnInit {
  userName = '';

  // ------- Constructor y carga de usuario -------
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if (user) this.userName = user.nombre;
    else this.router.navigate(['/login']);

    // cargar hábitos
    const saved = localStorage.getItem('studycare_habits');
    this.habits = saved ? JSON.parse(saved) : this.defaultHabits;
    this.saveHabits();
    this.updateMessage();
  }

  // ------- Estados de ánimo -------
  moods: { label: Mood; icon: string }[] = [
    { label: 'Terrible', icon: '😣' },
    { label: 'Mal', icon: '😞' },
    { label: 'Normal', icon: '😐' },
    { label: 'Bien', icon: '😊' },
    { label: 'Genial', icon: '😄' },
  ];
  navItems = [
    { path: '/inicio', label: 'Inicio', icon: '🏠' },
    { path: '/estados-animo', label: 'Ánimo', icon: '😊' },
    { path: '/asignaturas', label: 'Asignaturas', icon: '📘' },
    { path: '/recursos', label: 'Recursos', icon: '📚' },
    { path: '/recordatorios', label: 'Recordatorios', icon: '⏰' },
  ];

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  selectedMood: Mood = 'Normal';
  note: string = '';
  savedNote: string | null = null;

  selectMood(mood: Mood) {
    this.selectedMood = mood;
  }

  saveNote() {
    if (this.note.trim()) {
      this.savedNote = this.note;
      this.note = '';
    }
  }
  // Consejos para el usuario según su estado de ánimo
  tipsByMood: Record<Mood, Tip[]> = {
    Terrible: [
      {
        iconPath: '/assets/sleep-in-bed.svg',
        title: 'Recarga energías',
        description: 'Estar cansado esta bien, tómate un descanso.',
      },
      {
        iconPath: '/assets/no-mobile-phones.svg',
        title: 'Desconéctate un rato',
        description: 'Evita pantallas por 10 minutos para descansar tu mente.',
      },
      {
        iconPath: '/assets/park.svg',
        title: 'Date un paseo',
        description: 'Ve a dar un paseo al aire libre para despejar tu mente.',
      },
    ],
    Mal: [
      {
        iconPath: '/assets/stretching.svg',
        title: 'Estírate un poco',
        description: 'Unos movimientos suaves pueden ayudarte a liberar tensión.',
      },
      {
        iconPath: '/assets/bangkok-street-food.svg',
        title: '¿Ya comiste algo?',
        description: 'Date un atojo.',
      },
      {
        iconPath: '/assets/talking.svg',
        title: 'Habla con alguien',
        description: 'Habla con la persona que siempre te hace sacar una sonrisa.',
      },
    ],
    Normal: [
      {
        iconPath: '/assets/water-drop.svg',
        title: 'Mantente hidratado',
        description: 'Recuerda beber suficiente agua hoy.',
      },
      {
        iconPath: '/assets/music.svg',
        title: 'Escucha algo de musica',
        description: 'Escuchar tu canción favorita puede mejorar tu ánimo.',
      },
    ],
    Bien: [
      {
        iconPath: '/assets/yoga.svg',
        title: 'Respiración consciente',
        description: 'Toma 5 respiraciones profundas para mantener tu calma.',
      },
      {
        iconPath: '/assets/water-drop.svg',
        title: 'Sigue hidratándote',
        description: 'Tu cuerpo te lo agradecerá.',
      },
    ],
    Genial: [
      {
        iconPath: '/assets/love-letter-mail.svg',
        title: 'Comparte tu energía',
        description: 'Envía un mensaje positivo a alguien que quieras.',
      },
      {
        iconPath: '/assets/happy-alt.svg',
        title: 'Celebra tu bienestar',
        description: 'Reconoce lo bien que te sientes hoy.',
      },
    ],
  };
  // Filtra los consejos según el estado de ánimo seleccionado
  get filteredTips(): Tip[] {
    return this.tipsByMood[this.selectedMood] || [];
  }

  // ------- Hábitos y bienestar -------
  habits: Habit[] = [];
  message: string = '';
  selectedHabit: Habit | null = null;
  showDetailModal = false;
  showCreateModal = false;
  newHabit: Partial<Habit> = { icon: '✨', name: '', description: '' };

  defaultHabits: Habit[] = [
    {
      id: 1,
      name: 'Beber agua',
      description: 'Toma al menos 8 vasos de agua al día.',
      icon: '💧',
      completed: false,
    },
    {
      id: 2,
      name: 'Meditar',
      description: 'Dedica 5 minutos a respirar conscientemente.',
      icon: '🧘',
      completed: false,
    },
    {
      id: 3,
      name: 'Ejercicio',
      description: 'Muévete al menos 15 minutos hoy.',
      icon: '🏃',
      completed: false,
    },
    {
      id: 4,
      name: 'Dormir bien',
      description: 'Duerme mínimo 7 horas esta noche.',
      icon: '🌙',
      completed: false,
    },
  ];

  saveHabits() {
    localStorage.setItem('studycare_habits', JSON.stringify(this.habits));
    this.updateMessage();
  }

  get progress(): number {
    if (!this.habits.length) return 0;
    const done = this.habits.filter((h) => h.completed).length;
    return Math.round((done / this.habits.length) * 100);
  }

  updateMessage() {
    const p = this.progress;
    if (p === 0) this.message = '¡Comienza tu día con energía!';
    else if (p < 50) this.message = 'Vas bien, sigue con tus hábitos 💪';
    else if (p < 100) this.message = '¡Excelente progreso! 🌟';
    else this.message = '¡Felicidades! Completaste todos tus hábitos 🏆';
  }

  toggleHabit(habit: Habit) {
    habit.completed = !habit.completed;
    this.saveHabits();
  }

  // ------- Modales -------
  openDetailModal(habit: Habit) {
    this.selectedHabit = { ...habit };
    this.showDetailModal = true;
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeModals() {
    this.showDetailModal = false;
    this.showCreateModal = false;
    this.selectedHabit = null;
    this.newHabit = { icon: '✨', name: '', description: '' };
  }

  toggleCompleted() {
    if (!this.selectedHabit) return;
    const target = this.habits.find((h) => h.id === this.selectedHabit!.id);
    if (target) target.completed = !target.completed;
    this.saveHabits();
    this.closeModals();
  }

  deleteHabit() {
    if (!this.selectedHabit) return;
    this.habits = this.habits.filter((h) => h.id !== this.selectedHabit!.id);
    this.saveHabits();
    this.closeModals();
  }

  createHabit() {
    if (!this.newHabit.name || !this.newHabit.description) return;
    const newId = this.habits.length ? Math.max(...this.habits.map((h) => h.id)) + 1 : 1;
    const habit: Habit = {
      id: newId,
      name: this.newHabit.name!,
      description: this.newHabit.description!,
      icon: this.newHabit.icon || '✨',
      completed: false,
    };
    this.habits.push(habit);
    this.saveHabits();
    this.closeModals();
  }
}
