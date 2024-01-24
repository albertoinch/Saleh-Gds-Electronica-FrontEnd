import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VistasComponent } from './vistas.component';
import { AuthGuard } from './_utils/guard';
//import { Role } from './../modelos/rol';

const routes: Routes = [
  {
    path: '',
    component: VistasComponent,
    children: [
      { path: '', redirectTo: 'ventas', pathMatch: 'prefix' },
      {
        path: 'ventas',
        loadChildren: () => import('./principal/principal.module').then(m => m.PrincipalModule),
        canActivate: [AuthGuard], 
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VistasRoutingModule {}
