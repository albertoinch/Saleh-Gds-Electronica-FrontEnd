import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../../../servicios/item.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Para control de roles
import { UsuarioService } from '../../../../../servicios/usuario.service';
import { Rol } from '../../../../../modelos/rol';
@Component({
  selector: 'app-lista-items',
  templateUrl: './lista-items.component.html',
  styleUrls: ['./lista-items.component.scss']
})
export class ListaItemsComponent implements OnInit {

  constructor(private itemService: ItemService,
    private alertService: AlertService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private usuarioService: UsuarioService,) { }

  public items: any;
  public buscarActividad: any;
  public buscarCodigo: any;
  public buscarCodigoSin: any;
  public limit: any;
  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};
  public actividad = false;
  public codigoInt = false;
  public codigoSin = false;
  public descripcion = false;
  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  public idItem: any;//->para modal


  ngOnInit() {
    this.items = [];
    this.actualizarDatos();
  }

  actualizarDatos() {
    this.items = [];
    this.buscarActividad = "";
    this.buscarCodigo = "";
    this.buscarCodigoSin = "";
    this.limit = 10;

    this.close();
    this.paginar(1,this.buscarActividad, this.buscarCodigo, this.buscarCodigoSin, this.limit);
  }

  actualizarCat() {
    this.itemService.getCatalogo().then(data => {
      if (data.finalizado) {
        alert(data.mensaje);
      } else {
        this.alertService.danger(this.translate.instant(data.error.mensaje));
      }
    }).catch(error=>{
      this.alertService.danger(this.translate.instant(error));
    });
  }

  paginar(page: number, buscarA, buscarC, buscarCS, limit) { 
    if (page < 1 || !page) {
        return;
    }

    this.items = [];
    this.itemService.getIndexItems(page, buscarA, buscarC, buscarCS, limit).then(data => {
      if (data.finalizado) {
        this.items = data.datos;
        this.paginacion.total = data.paginacion.totalRegistros;
        this.paginacion.cantidad = data.paginacion.cantidad;
        this.paginacion.totalPaginas = data.paginacion.paginas;
        this.paginacion.paginaActual = parseInt(data.paginacion.paginaActual);
      }else{
        this.alertService.danger( this.translate.instant(data.error.mensaje));
      }
    }).catch(error=>{
      this.alertService.danger( this.translate.instant(error));
    });
  }

   //cerrar filtro de busqueda
   close() {
    this.actividad = false;
    this.codigoInt = false;
    this.codigoSin = false;
    this.descripcion = false;

    this.buscarActividad = "";
    this.buscarCodigo = "";
    this.buscarCodigoSin = "";

    this.modalSeccion = "";
    this.modalData = "";
    this.idItem = null;

    this.paginar(1,this.buscarActividad, this.buscarCodigo, this.buscarCodigoSin, this.limit);
  }

  casoBusqueda(caso) {
    this.buscarActividad = "";
    this.buscarCodigo = "";
    this.buscarCodigoSin = "";

    switch (caso) {
      //actividad economica
      case 1:
        this.actividad = true;
        this.codigoInt = false;
        this.codigoSin = false;
        this.descripcion = false;
        break;
      //codigo interno
      case 2:
        this.actividad = false;
        this.codigoInt = true;
        this.codigoSin = false;
        this.descripcion = false;
        break;
      //nro factura
      case 3:
        this.actividad = false;
        this.codigoInt = false;
        this.codigoSin = true;
        this.descripcion = false;
        break;
      //fecha
      case 4:
        this.actividad = false;
        this.codigoInt = false;
        this.codigoSin = false;
        this.descripcion = true;
        break;
      default:
        break;
    }
  }

  buscar() {
    if (this.buscarActividad != "" || this.buscarCodigo != 0 || this.buscarCodigoSin != "" ) {
      this.paginar(1,this.buscarActividad, this.buscarCodigo, this.buscarCodigoSin, this.limit);
    }
  }

  getRol() {
    return this.usuarioService.getRol();
  }


  permiteCrear(){
    const currentRol= this.getRol();
    if (Rol.Admin === currentRol || Rol.AdminFactura === currentRol) {
        return true;
    } else
      return false;
  }

  abrirModal(plantilla, aData, seccion) {
    this.modalSeccion = seccion;
    this.modalData = aData;
    this.idItem = null;
    switch (seccion) {
      case 'solicitud':
        this.modalTitulo = this.translate.instant('modal.tituloSolicitud');
        this.idItem = aData.id_item;
        break;
      case 'validacion':
        this.modalTitulo = this.translate.instant('modal.tituloValidacion');
        this.idItem = aData.id_item;
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
    this.idItem = null;
    this.modalData = [];
    this.modalRef.close(this.itemService);
  }

  enviarSolicitud(){
    this.itemService.postSolicitud(this.idItem).then(data=>{
      if (data.finalizado) {
        this.alertService.success(this.translate.instant(data.mensaje));
      } else {
        this.alertService.danger(this.translate.instant(data.error.mensaje));
      }
    });
  }

  enviarValidacion(){
    this.itemService.postValidacion(this.idItem).then(data=>{
      if (data.finalizado) {
        this.alertService.success(this.translate.instant(data.mensaje));
      } else {
        this.alertService.danger(this.translate.instant(data.error.mensaje));
      }
    });
  }

}
