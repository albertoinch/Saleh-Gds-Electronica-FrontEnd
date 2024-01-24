import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './vistas/_utils';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./vistas/vistas.module').then(m => m.VistasModule),
    canActivate: [AuthGuard]
  },
  { path: 'acceso', loadChildren: () => import('./acceso/acceso.module').then(m => m.AccesoModule) },
  { path: 'error', loadChildren: () => import('./pagina-error/pagina-error.module').then(m => m.PaginaErrorModule) },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
