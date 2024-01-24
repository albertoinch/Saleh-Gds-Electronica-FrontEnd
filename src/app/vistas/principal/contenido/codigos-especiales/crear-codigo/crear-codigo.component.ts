import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CodigoEspecial } from '../../../../../modelos/codigoEspecial';
import { CodigoEspecialService } from '../../../../../servicios/codigo-especial.service';
import { CatalogoService } from '../../../../../servicios/catalogo.service';
import { SucursalService } from '../../../../../servicios/sucursal.service';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-crear-codigo',
  templateUrl: './crear-codigo.component.html',
  styleUrls: ['./crear-codigo.component.scss']
})
export class CrearCodigoComponent implements OnInit {

  constructor(private codigoEspecialService:CodigoEspecialService,
    private alertService: AlertService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private sucursalService:SucursalService, 
    private router:Router,
    private catalogoService:CatalogoService) { }
  
  public codigoEspecial: CodigoEspecial = {
    fidPuntoVenta:null,
    tipo: null,
    codigo: null,
    fechaFin: null
  }
  fecha:any;
  listaPuntosVenta: any;
  listaTiposCodigos: any;
  //validaciones Campos
  validacionTipo:any;
  validacionCodigo:any;
  validacionFechaFin:any;
  validacionFid:any;
  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;

  ngOnInit() {
    this.sucursalService.getPuntosVenta().then(data=>{
    	this.listaPuntosVenta = data.datos
    });
    this.catalogoService.getCodigosEspeciales().then(data=>{
    	this.listaTiposCodigos = data.datos
    });
  }

  crearRegistro(){
    if (!this.codigoEspecial.tipo || !this.codigoEspecial.codigo || !this.fecha || !this.codigoEspecial.fidPuntoVenta) {
      this.alertService.danger(
        this.translate.instant('error.ventas.requerido')
      );
      this.validaciones();
    } else {
      this.codigoEspecial.fechaFin = `${this.fecha.year}-${this.fecha.month}-${this.fecha.day}`;
      this.codigoEspecial.tipo = this.codigoEspecial.tipo.toUpperCase();
      this.codigoEspecialService.postCodigos(this.codigoEspecial).then(data =>{
        if (data.finalizado) {
          this.alertService.success(
            this.translate.instant('mensaje.codigos-especiales.codigoCreado')
          );
        } else {
          if (data.error.mensaje) {
            this.alertService.danger(data.error.mensaje);
          }
        }
        this.router.navigate(['/ventas/codigos-especiales']);
      })
    }
  }

  validaciones(){
    (this.codigoEspecial.codigo) ? this.validacionCodigo = false: this.validacionCodigo = true;
    (this.codigoEspecial.tipo) ? this.validacionTipo = false: this.validacionTipo= true;
    (this.codigoEspecial.fechaFin) ? this.validacionFechaFin = false: this.validacionFechaFin = true;
    (this.codigoEspecial.fidPuntoVenta) ? this.validacionFid = false: this.validacionFid = true;
  }

  validacionesTipo(){
    (this.codigoEspecial.tipo) ? this.validacionTipo = false: this.validacionTipo = true;
  }

  validacionesCodigo(){
    (this.codigoEspecial.codigo) ? this.validacionCodigo = false: this.validacionCodigo = true;
  }

  validacionesFechaF(){
    (this.codigoEspecial.fechaFin) ? this.validacionFechaFin = false: this.validacionFechaFin = true;
  }

  validacionesFid(){
    (this.codigoEspecial.fidPuntoVenta) ? this.validacionFid = false: this.validacionFid = true;
  }

  actualizarPagina() {
    this.codigoEspecialService.actualizarPagina();
  }

  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('modal.tituloCrearCodigo');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.modalRef.close(this.codigoEspecialService);
  }

}
