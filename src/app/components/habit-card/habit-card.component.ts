import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-habit-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habit-card.component.html',
  styleUrls: ['./habit-card.component.css']
})
export class HabitCardComponent {
  @Input() habit: any; // Recibe el hábito desde el padre
  @Output() select = new EventEmitter<void>(); // Emite cuando la tarjeta es seleccionada

  onSelect() {
    this.select.emit(); // Notifica al componente padre que se hizo clic
  }
}
