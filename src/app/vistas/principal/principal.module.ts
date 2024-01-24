import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbModule,
  NgbCarouselModule,
  NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { PrincipalRoutingModule } from './principal-routing.module';
import { PrincipalComponent } from './principal.component';
import { StatModule, PageHeaderModule } from '../_utils';
import {
  InicioComponent,
  TablasComponent,
  FechasComponent,
  DatePickerComponent,
  TimePickerComponent,
  VentanasComponent,
  CrearFacturaComponent,
  EventosSignificativosComponent,
  CrearEventoComponent,
  VentasOfflineComponent,
  RegeneraFacturaComponent,
  DepositoComponent,
  VentasContingenciaComponent,
  CrearFacturaContingenciaComponent,
  RegenerarContingenciaComponent,
  ListaClientesComponent,
  EditarClienteComponent,
  CrearClienteComponent,
  ListaItemsComponent,
  CrearItemComponent,
  EditarItemComponent,
  CodigosEspecialesComponent,
  CrearCodigoComponent,
  CrearPuntoVentaComponent,
  CrearSucursalComponent,
  ListarPuntosVentaComponent,
  ListarSucursalesComponent,
  ListarContribuyentesComponent,
  ReportesComponent,
  ListaUsuariosComponent,
  PerfilComponent
} from './contenido';
import { GraficosComponent } from './contenido/graficos/graficos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    NgbCarouselModule.forRoot(),
    NgbAlertModule.forRoot(),
    Ng2Charts,
    TranslateModule,
    PrincipalRoutingModule,
    StatModule,
    PageHeaderModule
  ],
  declarations: [
    PrincipalComponent,
    InicioComponent,
    TablasComponent,
    FechasComponent,
    DatePickerComponent,
    TimePickerComponent,
    VentanasComponent,
    GraficosComponent,
    CrearFacturaComponent,
    EventosSignificativosComponent,
    CrearEventoComponent,
    VentasOfflineComponent,
    RegeneraFacturaComponent,
    DepositoComponent,
    VentasContingenciaComponent,
    CrearFacturaContingenciaComponent,
    RegenerarContingenciaComponent,
    ListaItemsComponent,
    CrearItemComponent,
    EditarItemComponent,
    CodigosEspecialesComponent,
    CrearCodigoComponent,
    ListaClientesComponent,
    EditarClienteComponent,
    CrearClienteComponent,
    CrearPuntoVentaComponent,
    CrearSucursalComponent,
    ListarPuntosVentaComponent,
    ListarSucursalesComponent,
    ListarContribuyentesComponent,
    ReportesComponent,
    ListaUsuariosComponent,
    PerfilComponent
  ]
})
export class PrincipalModule {}
