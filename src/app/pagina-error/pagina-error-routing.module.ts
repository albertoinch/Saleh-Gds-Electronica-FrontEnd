import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaginaErrorComponent } from './pagina-error.component';

const routes: Routes = [
  {
    path: '',
    component: PaginaErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaginaErrorRoutingModule {}
