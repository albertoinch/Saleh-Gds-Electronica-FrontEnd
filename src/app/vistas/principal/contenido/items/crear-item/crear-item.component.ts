import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Item } from '../../../../../modelos/item';
import { ItemService } from '../../../../../servicios/item.service';
import { CatalogoService } from '../../../../../servicios/catalogo.service';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-crear-item',
  templateUrl: './crear-item.component.html',
  styleUrls: ['./crear-item.component.scss']
})
export class CrearItemComponent implements OnInit {

  constructor(private itemService:ItemService,
    private alertService: AlertService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private catalogoService:CatalogoService, 
    private router:Router) { }

  public item:Item = {
    actividad_economica: "841001",
    codigo: "",
    codigo_sin: "99100",
    descripcion: null,
    precio_unitario: 0,
    codigo_moneda: "1",
    codigo_unidad: "58",
    tipo_documento_fiscal: "1",
    tipo_documento_sector: "1"
  }
  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  public idVenta: any;//->para modal

  listaActividades:any
  listaCodigoSin:any
  listaUnidades:any
  listaMonedas:any
  listaFiscales:any
  listaSector:any

  //validaciones
  validacionCI:any;
  validacionDesc:any;
  validacionPU:any;
  validacionUM:any;
  validacionM:any;
  validacionF:any;
  validacionS:any;

  ngOnInit() {
    this.catalogoService.getActividades().then(data=>{
      this.listaActividades = data.datos;
    });
    this.catalogoService.getUnidadMedida().then(data=>{
      this.listaUnidades = data.datos;
    });
    this.catalogoService.getTipoDocumentoSector().then(data=>{
      this.listaSector = data.datos;
    });
    this.buscaCodigos();
  }

  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('modal.tituloCrearItem');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.modalRef.close(this.itemService);
  }

  buscaCodigos(){
    this.catalogoService.getCodigoSinA(this.item.actividad_economica).then(data=>{
      this.listaCodigoSin = data.datos;
    })
  }

  crearRegistro(){
    if( !this.item.codigo ||  !this.item.descripcion || !this.item.codigo_unidad || !this.item.tipo_documento_sector){
      this.alertService.danger(
        this.translate.instant('error.ventas.requerido')
      );
      this.validaciones();
    } else {
      if (!this.item.actividad_economica) {
        this.item.actividad_economica = "";
        this.item.codigo_sin = "";
      }
      this.itemService.postItem(this.item).then(data=>{
        if (data.finalizado) {
          this.alertService.success(
            this.translate.instant('mensaje.item.itemCreado')
          );
        } else {
          if (data.error.mensaje) {
            this.alertService.danger(data.error.mensaje);
          }
        }
        this.router.navigate(['/ventas/items']);
      });
    }
  }
  
  validaciones(){
    (this.item.codigo) ? this.validacionCI = false: this.validacionCI = true;
    (this.item.descripcion) ? this.validacionDesc = false: this.validacionDesc = true;
    //(this.item.precio_unitario) ? this.validacionPU = false: this.validacionPU = true;
    (this.item.codigo_unidad) ? this.validacionUM = false: this.validacionUM = true;
    //(this.item.codigo_moneda) ? this.validacionM = false: this.validacionM = true;
    //(this.item.tipo_documento_fiscal) ? this.validacionF = false: this.validacionF = true;
    (this.item.tipo_documento_sector) ? this.validacionS = false: this.validacionS = true;
  }

  validacionesCI(){
    (this.item.codigo) ? this.validacionCI = false: this.validacionCI = true;
  } 

  validacionesDesc(){
    (this.item.descripcion) ? this.validacionDesc = false: this.validacionDesc = true;
  }

  validacionesPU(){
    (this.item.precio_unitario) ? this.validacionPU = false: this.validacionPU = true;
  }

  validacionesUM(){
    (this.item.codigo_unidad) ? this.validacionUM = false: this.validacionUM = true;
  }

  validacionesM(){
    (this.item.codigo_moneda) ? this.validacionM = false: this.validacionM = true;
  }

  validacionesF(){
    (this.item.tipo_documento_fiscal) ? this.validacionF = false: this.validacionF = true;
  }

  validacionesS(){
    (this.item.tipo_documento_sector) ? this.validacionS = false: this.validacionS = true;
  }

  actualizarPagina() {
    this.itemService.actualizarPagina();
  }

}
