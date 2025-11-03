import { Routes } from '@angular/router';
import { PgEstadosAnimo } from './pages/pg-estados-animo/pg-estados-animo';
import { PgInicio } from './pages/pg-inicio/pg-inicio';

export const routes: Routes = [{ path: 'estados-animo', component: PgEstadosAnimo }, { path: '', component: PgInicio },];
