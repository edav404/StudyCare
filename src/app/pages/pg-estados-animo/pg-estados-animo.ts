import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { FormsModule } from '@angular/forms';

interface Tip {
  iconPath: string;
  title: string;
  description: string;
}

type Mood = 'Terrible' | 'Mal' | 'Normal' | 'Bien' | 'Genial';

@Component({
  selector: 'app-pg-estados-animo',
  imports: [CommonModule, FormsModule],
  templateUrl: './pg-estados-animo.html',
  styleUrl: './pg-estados-animo.css',
})
export class PgEstadosAnimo {
  userName = 'Samuel'; // o pásalo como input si lo tienes global
  // Lista de estados de ánimo
  moods: { label: Mood; icon: string }[] = [
    { label: 'Terrible', icon: '😣' },
    { label: 'Mal', icon: '😞' },
    { label: 'Normal', icon: '😐' },
    { label: 'Bien', icon: '😊' },
    { label: 'Genial', icon: '😄' },
  ];
  // Estado de ánimo seleccionado y nota
  selectedMood: Mood = 'Normal';

  selectMood(mood: Mood) {
    this.selectedMood = mood;
  }
  // Nota escrita por el usuario
  note: string = '';
  savedNote: string | null = null;
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
      description: 'Estar cansado esta bien, tómate un descanso.'
    },
    {
      iconPath: '/assets/no-mobile-phones.svg',
      title: 'Desconéctate un rato',
      description: 'Evita pantallas por 10 minutos para descansar tu mente.'
    },
    {
      iconPath: '/assets/park.svg',
      title: 'Date un paseo',
      description: 'Ve a dar un paseo al aire libre para despejar tu mente.'
    }
  ],

  Mal: [
    {
      iconPath: '/assets/stretching.svg',
      title: 'Estírate un poco',
      description: 'Unos movimientos suaves pueden ayudarte a liberar tensión.'
    },
    {
      iconPath: '/assets/bangkok-street-food.svg',
      title: '¿Ya comiste algo?',
      description: 'Date un atojo.'
    },
    {
      iconPath: '/assets/talking.svg',
      title: 'Habla con alguien',
      description: 'Habla con la persona que siempre te hace sacar una sonrisa.'
    }
  ],
  Normal: [
    {
      iconPath: '/assets/water-drop.svg',
      title: 'Mantente hidratado',
      description: 'Recuerda beber suficiente agua hoy.'
    },
    {
      iconPath: '/assets/music.svg',
      title: 'Escucha algo de musica',
      description: 'Escuchar tu canción favorita puede mejorar tu ánimo.'
    }
  ],
  Bien: [
    {
      iconPath: '/assets/yoga.svg',
      title: 'Respiración consciente',
      description: 'Toma 5 respiraciones profundas para mantener tu calma.'
    },
    {
      iconPath: '/assets/water-drop.svg',
      title: 'Sigue hidratándote',
      description: 'Tu cuerpo te lo agradecerá.'
    }
  ],
  Genial: [
    {
      iconPath: '/assets/love-letter-mail.svg',
      title: 'Comparte tu energía',
      description: 'Envía un mensaje positivo a alguien que quieras.'
    },
    {
      iconPath: '/assets/happy-alt.svg',
      title: 'Celebra tu bienestar',
      description: 'Reconoce lo bien que te sientes hoy.'
    }
  ]
};
// Filtra los consejos según el estado de ánimo seleccionado
get filteredTips(): Tip[] {
  return this.tipsByMood[this.selectedMood] || [];
}

}
