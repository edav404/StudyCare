import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

interface Nota {
  nombre: string;
  calificacion: number;
  porcentaje: number;
}

interface Asignatura {
  id: number;
  nombre: string;
  calificacionFinal: number;
  semestre: string;
  notas: Nota[];
}

@Component({
  selector: 'app-pg-asignatura',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pg-asignatura.html',
  styleUrls: ['./pg-asignatura.css'],
})
export class PgAsignatura implements OnInit {
  // 🔹 Datos principales
  asignaturas: Asignatura[] = [];
  asignaturasFiltradas: Asignatura[] = [];
  selectedAsignatura: Asignatura | null = null;

  // 🔹 Control de modales
  showDetailModal = false;
  showCreateModal = false;

  // 🔹 Filtro de semestre
  filtroSemestre: string = 'Todos';
  semestres = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  // 🔹 Formularios temporales
  nuevaAsignatura: Partial<Asignatura> = { nombre: '', semestre: '', notas: [] };
  nuevaNota: Partial<Nota> = { nombre: '', calificacion: 0, porcentaje: 0 };

  // 🔹 Navegación lateral
  navItems = [
  { path: '/inicio', label: 'Inicio', icon: '🏠' },
  { path: '/estados-animo', label: 'Ánimo', icon: '😊' },
  { path: '/asignaturas', label: 'Asignaturas', icon: '📘' },
  { path: '/recursos', label: 'Recursos', icon: '📚' },
  { path: '/recordatorios', label: 'Recordatorios', icon: '⏰' },
];


  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    const saved = localStorage.getItem('studycare_asignaturas');
    this.asignaturas = saved ? JSON.parse(saved) : [];
    this.filtrarPorSemestre();
  }

  // 🔹 Verifica si el nav está activo
  isActive(path: string): boolean {
    return this.router.url === path;
  }

  // 🔹 Guardar en localStorage
  private guardarAsignaturas() {
    localStorage.setItem('studycare_asignaturas', JSON.stringify(this.asignaturas));
  }

  // 🔹 Filtrar asignaturas por semestre
  filtrarPorSemestre() {
    if (this.filtroSemestre === 'Todos') {
      this.asignaturasFiltradas = [...this.asignaturas];
    } else {
      this.asignaturasFiltradas = this.asignaturas.filter(
        (a) => a.semestre === this.filtroSemestre
      );
    }
  }

  // 🔹 Abrir/Cerrar modales
  openCreateModal() {
    this.nuevaAsignatura = { nombre: '', semestre: '', notas: [] };
    this.showCreateModal = true;
  }

  closeModals() {
    this.showCreateModal = false;
    this.showDetailModal = false;
    this.selectedAsignatura = null;
  }

  // 🔹 Crear una nueva asignatura
  crearAsignatura() {
    if (!this.nuevaAsignatura.nombre || !this.nuevaAsignatura.semestre) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const nueva: Asignatura = {
      id: this.asignaturas.length ? Math.max(...this.asignaturas.map((a) => a.id)) + 1 : 1,
      nombre: this.nuevaAsignatura.nombre!,
      semestre: this.nuevaAsignatura.semestre!,
      notas: [],
      calificacionFinal: 0,
    };

    this.asignaturas.push(nueva);
    this.guardarAsignaturas();
    this.filtrarPorSemestre();
    this.closeModals();
  }

  // 🔹 Abrir detalle de asignatura
  openDetailModal(asignatura: Asignatura) {
    this.selectedAsignatura = { ...asignatura };
    this.showDetailModal = true;
  }

  // 🔹 Agregar nota con validaciones
  agregarNota() {
    if (!this.selectedAsignatura || !this.nuevaNota.nombre) return;

    const calif = Number(this.nuevaNota.calificacion);
    const porc = Number(this.nuevaNota.porcentaje);

    // Validaciones
    if (isNaN(calif) || calif < 0 || calif > 5) {
      alert('⚠️ La calificación debe estar entre 0 y 5.');
      return;
    }

    if (isNaN(porc) || porc <= 0 || porc > 100) {
      alert('⚠️ El porcentaje debe estar entre 1 y 100.');
      return;
    }

    const totalPeso = this.selectedAsignatura.notas.reduce((acc, n) => acc + n.porcentaje, 0) + porc;
    if (totalPeso > 100) {
      alert('⚠️ La suma de porcentajes no puede superar el 100%.');
      return;
    }

    const nota: Nota = {
      nombre: this.nuevaNota.nombre!,
      calificacion: calif,
      porcentaje: porc,
    };

    this.selectedAsignatura.notas.push(nota);
    this.calcularPromedio();
    this.actualizarAsignatura();
    this.nuevaNota = { nombre: '', calificacion: 0, porcentaje: 0 };
  }

  // 🔹 Eliminar nota
  eliminarNota(index: number) {
    if (!this.selectedAsignatura) return;
    this.selectedAsignatura.notas.splice(index, 1);
    this.calcularPromedio();
    this.actualizarAsignatura();
  }

  // 🔹 Calcular promedio ponderado
  calcularPromedio() {
    if (!this.selectedAsignatura) return;
    const totalPeso = this.selectedAsignatura.notas.reduce((acc, n) => acc + n.porcentaje, 0);
    if (totalPeso === 0) {
      this.selectedAsignatura.calificacionFinal = 0;
      return;
    }

    const promedio = this.selectedAsignatura.notas.reduce(
      (acc, n) => acc + n.calificacion * (n.porcentaje / 100),
      0
    );

    this.selectedAsignatura.calificacionFinal = parseFloat(promedio.toFixed(2));
  }

  // 🔹 Actualizar asignatura (después de editar o eliminar notas)
  actualizarAsignatura() {
    if (!this.selectedAsignatura) return;
    const idx = this.asignaturas.findIndex((a) => a.id === this.selectedAsignatura!.id);
    if (idx >= 0) {
      this.asignaturas[idx] = this.selectedAsignatura!;
      this.guardarAsignaturas();
      this.filtrarPorSemestre();
    }
  }

  // 🔹 Eliminar asignatura completa
  eliminarAsignatura(asignatura: Asignatura) {
    this.asignaturas = this.asignaturas.filter((a) => a.id !== asignatura.id);
    this.guardarAsignaturas();
    this.filtrarPorSemestre();
  }
}
