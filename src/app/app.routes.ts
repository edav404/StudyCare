import { Routes } from '@angular/router';
import { PgEstadosAnimo } from './pages/pg-estados-animo/pg-estados-animo';
import { PgInicio } from './pages/pg-inicio/pg-inicio';
import { PgBienestarComponent } from './pages/pg-bienestar/pg-bienestar.component';
import { PgLogin } from './pages/pg-login/pg-login';
import { PgRegistrar } from './pages/pg-registrar/pg-registrar';
import { PgEditarPerfil } from './pages/pg-editar-perfil/pg-editar-perfil';
import { PgRecursosComponent } from './pages/pg-recursos/pg-recursos.component';

export const routes: Routes = [
  { path: 'login', component: PgLogin },
  { path: 'registrar', component: PgRegistrar },
  { path: 'editar-perfil', component: PgEditarPerfil },
  { path: 'estados-animo', component: PgEstadosAnimo },
  { path: 'bienestar', component: PgBienestarComponent },
  { path: 'pomodoro',
    loadComponent: () => import('./pages/pg-pomodoro/pg-pomodoro.component').then(m => m.PgPomodoroComponent)
  },
  { path: 'recursos',
    loadComponent: () =>
      import('./pages/pg-recursos/pg-recursos.component').then((m) => m.PgRecursosComponent), },
  { path: 'inicio', component: PgInicio },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' },
];