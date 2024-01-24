import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrincipalComponent } from './principal.component';
import { AuthGuard } from '../_utils/guard';
import { Rol } from '../../modelos/rol';

import {
  TablasComponent,
  FechasComponent,
  VentanasComponent,
  GraficosComponent,
  EventosSignificativosComponent,
  CrearFacturaComponent,
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
  ListarSucursalesComponent,
  ListarContribuyentesComponent,
  ListarPuntosVentaComponent,
  ReportesComponent,
  ListaUsuariosComponent,
  PerfilComponent
} from './contenido';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  {
    path: 'registrar-factura',
    component: CrearFacturaComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Admin] }

  },
  {
    path: 'eventos',
    component: EventosSignificativosComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Admin] }
        
  },
  {
    path: 'registrar-evento',
    component: CrearEventoComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Admin] }

  },
  {
    path: 'paquete',
    component: VentasOfflineComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura] }

  },
  {
    path: 'regenera-factura/:id',
    component: RegeneraFacturaComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Admin] }

  },
  {
    path: 'registrar-deposito/:id',
    component: DepositoComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Admin] }

  },
  {
    path: 'contingencias',
    component: VentasContingenciaComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Revisor, Rol.Admin] }

  },
  {
    path: 'registrar-factura-contingencia',
    component: CrearFacturaContingenciaComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Admin] }

  },
  {
    path: 'regenera-factura-contingencia/:id',
    component: RegenerarContingenciaComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura] }

  },
  {
    path: 'items',
    component: ListaItemsComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Admin] }
  },
  {
    path: 'registrar-item',
    component: CrearItemComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin, Rol.AdminFactura] }
  },
  {
    path: 'editar_item/:id',
    component: EditarItemComponent,
    data: { roles: [Rol.AdminFactura, Rol.Admin] }
  },
  {
    path: 'codigos-especiales',
    component: CodigosEspecialesComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin, Rol.Revisor] }
  },
  {
    path: 'registrar-codigos',
    component: CrearCodigoComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin, Rol.Revisor] }
  },
  {
    path: 'clientes',
    component: ListaClientesComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.AdminFactura, Rol.Admin] }
  },
  {
    path: 'editar_cliente/:id',
    component: EditarClienteComponent,
    data: { roles: [Rol.AdminFactura, Rol.Admin] }
  },
  {
    path: 'crear-punto-venta/:id',
    component: CrearPuntoVentaComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin] }
  },
  {
    path: 'crear-sucursal',
    component: CrearSucursalComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin] }
  },
  {
    path: 'sucursales',
    component: ListarSucursalesComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin] }
  },
  {
    path: 'contribuyentes',
    component: ListarContribuyentesComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin] }
  },
  {
    path: 'puntos-venta/:id',
    component: ListarPuntosVentaComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin] }
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin, Rol.AdminFactura, Rol.Revisor] }
  },
  {
    path: 'usuarios',
    component: ListaUsuariosComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin] }
  },
  {
    path: 'registrar-cliente',
    component: CrearClienteComponent,
    canActivate: [AuthGuard], 
    data: { roles: [Rol.Admin, Rol.AdminFactura] }
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard], 
    //data: { roles: [Rol.Admin] }
  },
  {
    path: 'tablas',
    component: TablasComponent
  },
  {
    path: 'fechas',
    component: FechasComponent
  },
  {
    path: 'ventanas',
    component: VentanasComponent
  },
  {
    path: 'graficos',
    component: GraficosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule {}
