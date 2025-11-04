import { Routes } from '@angular/router';
import { PgEstadosAnimo } from './pages/pg-estados-animo/pg-estados-animo';
import { PgInicio } from './pages/pg-inicio/pg-inicio';
import { PgBienestarComponent } from './pages/pg-bienestar/pg-bienestar.component';

// 🔽 Importamos los nuevos componentes
import { PgLogin } from './pages/pg-login/pg-login';
import { PgRegistrar } from './pages/pg-registrar/pg-registrar';
import { PgEditarPerfil } from './pages/pg-editar-perfil/pg-editar-perfil';

export const routes: Routes = [
  // Nuevas rutas
  { path: 'login', component: PgLogin },
  { path: 'registrar', component: PgRegistrar },
  { path: 'editar-perfil', component: PgEditarPerfil },

  // Rutas existentes
  { path: 'estados-animo', component: PgEstadosAnimo },
  { path: 'bienestar', component: PgBienestarComponent },
  { path: '', component: PgInicio },
];
