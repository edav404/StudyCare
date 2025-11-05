import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Importa esto

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: 'video' | 'article' | 'guide';
  url: string;
  thumbnail: string;
}

@Component({
  selector: 'app-pg-recursos',
  standalone: true, // ✅ Asegúrate de tener esto
  imports: [CommonModule], // ✅ Importa las directivas de Angular como *ngFor, *ngIf
  templateUrl: './pg-recursos.component.html',
  styleUrls: ['./pg-recursos.component.css']
})
export class PgRecursosComponent implements OnInit {
  resources: Resource[] = [];
  filtered: Resource[] = [];
  categories: string[] = ['Todos', 'Meditación', 'Técnicas de estudio', 'Motivación', 'Música'];
  types: string[] = ['Todos', 'Video', 'Artículo', 'Guía'];

  activeCategory = 'Todos';
  activeType = 'Todos';

  // UX state
  loading = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadResources();
  }

  loadResources() {
    this.loading = true;
    this.errorMessage = null;
    this.http.get<Resource[]>('assets/data/recursos.json').subscribe({
      next: (data) => {
        this.resources = data || [];
        this.filtered = [...this.resources];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar recursos.json', err);
        this.errorMessage = 'No se pudieron cargar los recursos locales. Intenta recargar.';
        this.filtered = [];
        this.loading = false;
      }
    });
  }

  filterResources() {
    this.filtered = this.resources.filter(r => {
      const matchCategory = this.activeCategory === 'Todos' || r.category === this.activeCategory;
      const matchType = this.activeType === 'Todos' || r.type === this.activeType;
      return matchCategory && matchType;
    });
  }

  filterByCategory(category: string) {
    this.activeCategory = category;
    this.filterResources();
  }

  filterByType(type: string) {
    this.activeType = type;
    this.filterResources();
  }
}
