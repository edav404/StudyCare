import { Routes } from '@angular/router';
import { PgEstadosAnimo } from './pages/pg-estados-animo/pg-estados-animo';
import { PgInicio } from './pages/pg-inicio/pg-inicio';
import { PgBienestarComponent } from './pages/pg-bienestar/pg-bienestar.component';

export const routes: Routes = [
	{ path: 'estados-animo', component: PgEstadosAnimo },
	{ path: 'bienestar', component: PgBienestarComponent },
	{ path: '', component: PgInicio },
];
