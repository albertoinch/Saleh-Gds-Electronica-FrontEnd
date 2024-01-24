import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../../../../servicios/sucursal.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
// Para control de roles
import { UsuarioService } from '../../../../../servicios/usuario.service';
import { Rol } from '../../../../../modelos/rol';
@Component({
  selector: 'app-listar-puntos-venta',
  templateUrl: './listar-puntos-venta.component.html',
  styleUrls: ['./listar-puntos-venta.component.scss']
})
export class ListarPuntosVentaComponent implements OnInit {

  constructor(private sucursalService: SucursalService,
    private alertService: AlertService,
  	private translate: TranslateService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService) { }
  idSucursal:any;
  sucursal={
    nombre:""
  };
  puntos: any;
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
  idPunto: any;//->para modal
  groupOptionsSelect: Array<any>;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idSucursal = params['id'];
    });
    this.sucursalService.getSucursal(this.idSucursal).then(data=>{
      if (data.finalizado) {
        this.sucursal = data.datos;
      } else {
        console.log("error",data.error.mensaje)
        this.alertService.danger( this.translate.instant(data.error.mensaje));
      }
    });
    this.groupOptionsSelect = [
      { value: 'ACTIVO', label: 'ACTIVO' },
      { value: 'INACTIVO', label: 'INACTIVO' }
    ];
    this.actualizarDatos();
  }

  actualizarDatos() {
    this.puntos = [];
    this.limit = 10;
    this.buscarEstado="";
    this.buscarNombre = "";
    this.buscarCodigo = 0;
    this.buscarTipo = "";
    this.nombre = false;
    this.codigo = false;
    this.estado = false;
    this.tipo = false;
    this.paginar(1, this.limit, this.buscarEstado, this.buscarNombre, this.buscarCodigo);
  }

  paginar(page: number, limit , buscarE, buscarN, buscarC ) { 
    if (page < 1 || !page) {
        return;
    }
    this.puntos = [];
    this.sucursalService.indexSucursalPuntoVenta(this.idSucursal, page, limit , buscarE, buscarN, buscarC).then(data => {
      if (data.finalizado) {
        this.puntos = data.datos;
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
  abrirModal(plantilla, aData, seccion) {
    this.modalSeccion = seccion;
    this.modalData = aData;
    this.idPunto = null;
    switch (seccion) {
      case 'registrarPunto':
        this.modalTitulo = this.translate.instant('modal.tituloRegPunto');
        this.idPunto = aData.id_punto_venta;
        break;
      case 'cerrarPunto':
        this.modalTitulo = this.translate.instant('modal.tituloCerrarPunto');
        this.idPunto = aData.id_punto_venta;
        break;
      case 'cuis':
        this.modalTitulo = this.translate.instant('modal.tituloCUIS');
        this.idPunto = aData.id_punto_venta;
        break;
      default:
        break;
    }

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.idPunto = null;
    this.modalData = [];
    this.modalRef.close(this.sucursalService);
  }

  registrarPunto(id){
    this.sucursalService.registrarPunto(this.idPunto).then(data=>{
      if(data.finalizado){
        this.alertService.success( this.translate.instant(data.mensaje));
      }else{
        this.alertService.danger( this.translate.instant(data.error.mensaje));
      }
    })
  }

  solicitarCuis(id){
    this.sucursalService.solicitarCuis(this.idPunto).then(data=>{
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
    this.paginar(1,this. limit, this.buscarEstado, this.buscarNombre, this.buscarCodigo);
  }

  buscar() {
    if (this.buscarNombre != "" || this.buscarCodigo != 0 || this.buscarEstado != "" || this.buscarTipo != "") {
      this.paginar(1,this. limit, this.buscarEstado, this.buscarNombre, this.buscarCodigo);
    }
  }

  cerrarPunto(){
    this.sucursalService.cerrarPuntoVenta(this.idPunto).then(data=>{
      if(data.finalizado){
        this.alertService.success( this.translate.instant(data.mensaje));
      }else{
        this.alertService.danger( this.translate.instant(data.error.mensaje));
      }
    })
  }

}
