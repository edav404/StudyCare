import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Importa esto

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string; // normalizamos a string lowercase en tiempo de ejecución
  url: string;
  thumbnail: string;
  favorite?: boolean;
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
  categories: string[] = ['Todos', 'Favoritos', 'Meditación', 'Técnicas de estudio', 'Motivación', 'Música'];
  types: string[] = ['Todos', 'video', 'artículo', 'guía'];

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
    this.http.get<Resource[]>('/assets/data/recursos.json').subscribe({
      next: (data) => {
        this.resources = (data || []).map(r => ({ ...r, favorite: false, type: (r.type || '').toString().toLowerCase() }));
        // cargar favoritos guardados
        this.loadFavoritesFromStorage();
        this.filterResources();
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

  // Favoritos: persistencia en localStorage
  private FAVORITES_KEY = 'studycare_favorites';

  private loadFavoritesFromStorage() {
    try {
      const raw = localStorage.getItem(this.FAVORITES_KEY);
      const favIds: number[] = raw ? JSON.parse(raw) : [];
      if (Array.isArray(favIds) && favIds.length) {
        this.resources.forEach(r => r.favorite = favIds.includes(r.id));
      }
    } catch (e) {
      console.error('Error leyendo favoritos desde localStorage', e);
    }
  }

  private persistFavoritesToStorage() {
    try {
      const favIds = this.resources.filter(r => r.favorite).map(r => r.id);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favIds));
    } catch (e) {
      console.error('Error guardando favoritos en localStorage', e);
    }
  }

  toggleFavorite(res: Resource) {
    res.favorite = !res.favorite;
    this.persistFavoritesToStorage();
    // si estamos filtrando por Favoritos, actualizar la lista mostrada
    if (this.activeCategory === 'Favoritos') {
      this.filterResources();
    }
  }

  filterResources() {
    this.filtered = this.resources.filter(r => {
      // Si el filtro activo es 'Favoritos', mostrar solo marcados
      let matchCategory = this.activeCategory === 'Todos' || r.category === this.activeCategory;
      if (this.activeCategory === 'Favoritos') {
        matchCategory = !!r.favorite;
      }
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
