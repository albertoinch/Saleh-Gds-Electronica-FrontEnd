import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../../../../servicios/sucursal.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Para control de roles
import { UsuarioService } from '../../../../../servicios/usuario.service';
import { Rol } from '../../../../../modelos/rol';
@Component({
  selector: 'app-listar-sucursales',
  templateUrl: './listar-sucursales.component.html',
  styleUrls: ['./listar-sucursales.component.scss']
})
export class ListarSucursalesComponent implements OnInit {

  constructor(private sucursalService: SucursalService,
    private alertService: AlertService,
  	private translate: TranslateService,
    private modalService: NgbModal,
    private usuarioService: UsuarioService) { }

    sucursales: any;
    limit: any;
    paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};
    //variables de busqueda
    buscarEstado: any;
    buscarNombre: any;
    buscarCodigo: any;
    buscarTipo: any;
  
    //variable para filtros
    estado: boolean = false;
    nombre: boolean = false;
    codigo: boolean = false;
    descripcion: boolean = false;
    tipo: boolean = false;
    tipoA: Array<any>;
    groupOptionsTipo: Array<any>;
  
    //variables de modal
    modalRef: NgbModalRef;
    modalData: any;
    modalSeccion: string;
    modalTitulo: any;
    idSucursal: any;//->para modal
    listaPuntos: any;
    paginacionP = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};
    //variables de busqueda
    buscarEstadoP: any;
    buscarNombreP: any;
    buscarCodigoP: any;
    buscarTipoP: any;
    limitP: any;
    groupOptionsSelect: Array<any>;

    ngOnInit() {
      this.groupOptionsSelect = [
        { value: 'ACTIVO', label: 'ACTIVO' },
        { value: 'INACTIVO', label: 'INACTIVO' }
      ];
      this.actualizarDatos();
    }
  
    actualizarDatos() {
      this.sucursales = [];
      this.limit = 10;
      this.buscarEstado="";
      this.buscarNombre = "";
      this.buscarCodigo = 0;
      this.buscarTipo = "";
      this.nombre = false;
      this.codigo = false;
      this.estado = false;
      this.tipo = false;
      this.paginar(1, this.limit, this.buscarEstado, this.buscarNombre, this.buscarCodigo/* , this.buscarTipo */);
    }
  
    paginar(page: number, limit , buscarE, buscarN, buscarC/* , buscarT */ ) { 
      if (page < 1 || !page) {
          return;
      }
      this.sucursales = [];
      this.sucursalService.indexSucursales(page, limit , buscarE, buscarN, buscarC).then(data => {
        if (data.finalizado) {
          this.sucursales = data.datos;
          this.paginacion.total = data.paginacion.totalRegistros;
          this.paginacion.cantidad = data.paginacion.cantidad;
          this.paginacion.totalPaginas = data.paginacion.paginas;
          this.paginacion.paginaActual = parseInt(data.paginacion.paginaActual);
         }else{
          console.log("error",data.error.mensaje)
          this.alertService.danger( this.translate.instant(data.error.mensaje));
        }
      }).catch(error=>{
        console.log("error",error)
      });
    }
  
    casoBusqueda(caso) {
      this.buscarEstado=""
      this.buscarNombre = "";
      this.buscarCodigo = 0;
      this.buscarTipo = "";
  
      switch (caso) {
        //estado
        case 1:
          this.nombre = false;
          this.estado = true;
          this.codigo = false;
          this.descripcion = false;
          this.tipo = false;
          break;
        //nombre
        case 2:
          this.estado = false;
          this.nombre = true;
          this.codigo = false;
          this.descripcion = false;
          this.tipo = false;
          break;
        //descripcion
        case 3:
          this.estado = false;
          this.nombre = false;
          this.codigo = false;
          this.descripcion = true;
          this.tipo = false;
        //codigo
        case 4:
          this.estado = false;
          this.nombre = false;
          this.codigo = true;
          this.descripcion = false;
          this.tipo = false;
          break;
        //tipo
        case 5:
          this.estado = false;
          this.nombre = false;
          this.codigo = false;
          this.descripcion = false;
          this.tipo = true;
          break;
        default:
            break;
        }
    }
    getRol() {
      return this.usuarioService.getRol();
    }
  
    permiteCrear(){
      const currentRol= this.getRol();
      if (Rol.Admin === currentRol) {
          return true;
      } else
        return false;
    }
    abrirModal(plantilla, aData) {
      this.modalTitulo = this.translate.instant('modal.tituloEditarSucursal');
      this.modalData = aData;
      this.idSucursal = aData.id_sucursal;

      this.modalRef = this.modalService.open(plantilla, {
        size: 'lg',
        backdrop: false,
        centered: false
      });
    }
  
    cerrarModal() {
      this.idSucursal = null;
      this.modalData = [];
      this.modalRef.close(this.sucursalService);
    }
  
    registrarSucursal(id){
      this.sucursalService.registrarSucursal(this.idSucursal, this.modalData).then(data=>{
        if(data.finalizado){
          this.alertService.success( this.translate.instant(data.mensaje));
        }else{
          this.alertService.danger( this.translate.instant(data.error.mensaje));
        }
      })
    }
  
    //cerrar filtro de busqueda
    close() {
      this.estado = false;
      this.nombre = false;
      this.descripcion = false;
      this.codigo = false;
      this.tipo = false;
  
      this.buscarEstado = "";
      this.buscarNombre = "";
      this.buscarCodigo = 0;
      this.buscarTipo = "";
      this.paginar(1,this. limit, this.buscarEstado, this.buscarNombre, this.buscarCodigo/* , this.buscarTipo */);
    }
  
    buscar() {
      if (this.buscarNombre != "" || this.buscarCodigo != 0 || this.buscarEstado != "" || this.buscarTipo != "") {
        this.paginar(1,this. limit, this.buscarEstado, this.buscarNombre, this.buscarCodigo/* , this.buscarTipo */);
      }
    }

    paginarP(id, page: number, limit , buscarE, buscarN, buscarC ) { 
      if (page < 1 || !page) {
          return;
      }
      this.listaPuntos = [];
      this.sucursalService.indexSucursalPuntoVenta(id, page, limit , buscarE, buscarN, buscarC).then(data => {
        if (data.finalizado) {
          this.listaPuntos = data.datos;
          this.paginacionP.total = data.paginacion.totalRegistros;
          this.paginacionP.cantidad = data.paginacion.cantidad;
          this.paginacionP.totalPaginas = data.paginacion.paginas;
          this.paginacionP.paginaActual = parseInt(data.paginacion.paginaActual);
         }else{
          console.log("error",data.error.mensaje)
          this.alertService.danger( this.translate.instant(data.error.mensaje));
        }
      }).catch(error=>{
        console.log("error",error)
      });
    }

}
