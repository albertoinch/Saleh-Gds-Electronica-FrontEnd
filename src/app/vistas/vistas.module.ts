import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { VistasRoutingModule } from './vistas-routing.module';
import { VistasComponent } from './vistas.component';

import { MenuSuperiorComponent, MenuLateralComponent } from './_seccion';
import { StatModule, PageHeaderModule } from './_utils';
import {  NgbModule,  NgbCarouselModule,  NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ReportesComponent } from './reportes/reportes.component';
// import { ListaClientesComponent } from './clientes/lista-clientes/lista-clientes.component';
// import { EditarClienteComponent } from './clientes/editar-cliente/editar-cliente.component';
// import { ListarSucursalesComponent } from './sucursales/listar-sucursales/listar-sucursales.component';
// // import { CrearSucursalComponent } from './sucursales/crear-punto-venta/crear-punto-venta.component';
// import { CrearPuntoVentaComponent } from './sucursales/crear-punto-venta/crear-punto-venta.component';
// import { ListarPuntosVentaComponent } from './sucursales/listar-puntos-venta/listar-puntos-venta.component';
// import { CrearSucursalComponent } from './sucursales/crear-sucursal/crear-sucursal.component';
@NgModule({
  imports: [NgbModule.forRoot(), NgbCarouselModule.forRoot(), NgbAlertModule.forRoot(), CommonModule, VistasRoutingModule, TranslateModule, NgbDropdownModule.forRoot(), StatModule, PageHeaderModule, FormsModule],
  declarations: [VistasComponent, MenuSuperiorComponent, MenuLateralComponent/* , ReportesComponent, ListaClientesComponent, EditarClienteComponent, ListarSucursalesComponent , CrearSucursalComponent , CrearPuntoVentaComponent, ListarPuntosVentaComponent, CrearSucursalComponent */]
})
export class VistasModule {}
