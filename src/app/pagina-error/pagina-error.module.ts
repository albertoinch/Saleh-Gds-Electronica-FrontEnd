import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginaErrorRoutingModule } from './pagina-error-routing.module';
import { PaginaErrorComponent } from './pagina-error.component';

@NgModule({
  imports: [CommonModule, PaginaErrorRoutingModule],
  declarations: [PaginaErrorComponent]
})
export class PaginaErrorModule {}
