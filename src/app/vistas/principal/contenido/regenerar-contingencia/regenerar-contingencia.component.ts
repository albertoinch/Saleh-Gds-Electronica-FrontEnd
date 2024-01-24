import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VentasService } from '../../../../servicios/ventas.service';
import { Detalle } from '../../../../modelos/detalle';
import { ItemService } from '../../../../servicios/item.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService } from '@ngx-translate/core';
import { FacturacionService } from '../../../../servicios/facturacion.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FacturaContingencia } from '../../../../modelos/contingencia';

import { ContingenciaService } from 'src/app/servicios/contingencia.service';
import { CatalogoService } from '../../../../servicios/catalogo.service';

import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-regenerar-contingencia',
  templateUrl: './regenerar-contingencia.component.html',
  styleUrls: ['./regenerar-contingencia.component.scss']
})
export class RegenerarContingenciaComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
  	private ventasService: VentasService,
  	private facturasService: FacturacionService,
  	private contingenciaService: ContingenciaService,
  	private itemService: ItemService,
  	private router: Router,
    private translate: TranslateService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private clientesService: ClientesService,
    private catalogoService: CatalogoService) { }
  idVenta:any;
  public detalle: Detalle = { idItem: null, cantidad: null };
  detalleI: Array<any>;
  groupOptionsSelect: Array<any>;
  groupTiposDoc: Array<any>;
  public items:any;
  //validaciones de campos
  validacionTD:boolean=null;
  validacionND:boolean=null;
  validacionNF:boolean=null;
  validacionRS:boolean=null;
  validacionCAED:boolean=null;
  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  caed:any;
  public factura: FacturaContingencia = {
    codigoSucursal: '0',
    codigoPuntoVenta: null,
    codigoTipoDocumentoIdentidad: '0',
    numeroDocumento: null,
    complemento: '',
    nombreRazonSocial: null,
    caed: null,
    fechaEmision: null,
    tipoCambio: null,
    codigoMetodoPago: null,
    descuentoAdicional: undefined,
    montoGiftCard: undefined,
    numeroTarjeta: undefined,
    numeroTarjeta1: undefined,
    numeroTarjeta2: undefined,
    tipoEmision: 2,
    numeroFactura: null,
    codigoExcepcionDocumento: null,
    pais: null,
    cafc: null,
    detalle: [{}]
  };
  fecha = {"year": 2019, month: 10, day: 22};
  hora = {hour: 24, minute: 10, second: 22};
  fecha2:any;
  marked = false;
excepcion:any;
  ngOnInit() {
  	this.activatedRoute.params.subscribe(params => {
        this.idVenta = params['id'];
    });
	  this.groupOptionsSelect = [
      { value: 1, label: 'EN LÍNEA' },
      { value: 2, label: 'FUERA DE LÍNEA' }
    ];
    this.catalogoService.getTiposDocumentoIdentidad().then(data => {
      this.groupTiposDoc = data.datos;
    });
    /* this.ventasService.getTipoDocumentosIdentidad().then(data => {
      this.groupTiposDoc = data.datos;
    }); */
    this.itemService.getItems().then(data =>{
      this.items = data.datos;
    });
    this.detalleI=[{}]
  	this.ventasService.buscarVenta(this.idVenta).then(data=>{
      this.factura.codigoTipoDocumentoIdentidad = data.datos.cliente.tipo_documento
      this.factura.numeroDocumento = data.datos.cliente.numero_documento
      this.factura.complemento = data.datos.cliente.complemento
      this.factura.nombreRazonSocial = data.datos.nombre_razon_social
      this.excepcion = data.datos.codigo_recepcion
      // this.factura.tipoEmision = data.datos.tipo_emision;
      for (var i = data.datos.detalle.length - 1; i >= 0; i--) {
        this.detalleI[i].idItem = data.datos.detalle[i].item.id_item;
        this.detalleI[i].cantidad = data.datos.detalle[i].cantidad;
      }
      this.factura.caed  = data.datos.caed
      this.factura.fechaEmision = data.datos.fecha_emision;
      //para fechas
      
      this.fecha2 = new Date(this.factura.fechaEmision);
      this.fecha = {
        year:this.fecha2.getFullYear(),
        month:this.fecha2.getMonth()+1,
        day:this.fecha2.getDate()
      };
      this.hora ={
        hour:this.fecha2.getHours(),
        minute:this.fecha2.getMinutes(),
        second:this.fecha2.getSeconds(),
      }

      this.factura.caed = data.datos.caed;
      this.factura.numeroFactura = data.datos.numero_factura;
    })
  }

  addItem(aData) {
    aData.push({});
  }

  delItem(aData) {
    aData.splice(-1, 1);
  }

  actualizarPagina() {
    this.facturasService.actualizarPagina();
  }

  crearRegistro() {
  	this.factura.tipoCambio = '1';
  	this.factura.codigoMetodoPago = 1;//--> efectivo
   
    if (!this.factura.codigoTipoDocumentoIdentidad || !this.factura.numeroDocumento || !this.factura.nombreRazonSocial || !this.factura.tipoEmision || !this.factura.caed || !this.factura.numeroFactura || !this.fecha || !this.hora) {
      this.validaciones();
      this.alertService.danger(
        this.translate.instant('error.ventas.requerido')
      );
    } else {
      if (!this.ventasService.validarProductos(this.detalleI)) {
        this.alertService.danger(
          this.translate.instant('error.ventas.productos')
        );
      } else {//form-control-sm
          if (this.factura.complemento == null) {
            this.factura.complemento ="";
          }
          this.factura.detalle = this.detalleI;
          this.factura.nombreRazonSocial = this.factura.nombreRazonSocial.toUpperCase();
          var month, day, second, hour,minute ;
          (this.fecha.month <= 9)? month = '0'+ this.fecha.month: month = this.fecha.month;
          (this.fecha.day <= 9)? day = '0'+ this.fecha.day: day = this.fecha.day;
          (this.hora.second <= 9)? second = '0'+ this.hora.second: second = this.hora.second;
          (this.hora.minute <= 9)? minute = '0'+ this.hora.minute: minute = this.hora.minute;
          (this.hora.hour <= 9)? hour = '0'+ this.hora.hour: hour = this.hora.hour;
          //this.factura.fechaEmision = `${this.fecha.year}-${month}-${day}T${hour}:${minute}:${second}.000`
          const nFechaEmision = new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day, this.hora.hour, this.hora.minute, this.hora.second);
          this.factura.fechaEmision = nFechaEmision;
          this.contingenciaService.regenerarVentaCObs(this.idVenta, this.factura).then(dataPost => {
            if (dataPost.finalizado) {
              this.alertService.success(
                this.translate.instant('mensaje.ventas.regeneraFactura')
              );
            } else {
              if (dataPost.error.mensaje) {
                this.alertService.danger(dataPost.error.mensaje);
              }
            }
            this.router.navigate(['/ventas/contingencias']);
          });
      }
    }
  }

  validaciones(){
     if (!this.factura.codigoTipoDocumentoIdentidad) {
      this.validacionTD = true;
    }
    if (!this.factura.numeroDocumento) {
      this.validacionND = true;
    }
    if (!this.factura.numeroFactura) {
      this.validacionNF = true;
    }
    if (!this.factura.nombreRazonSocial) {
      this.validacionRS = true;
    }
    if (!this.factura.caed) {
      this.validacionCAED = true;
    }
  }

  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('modal.tituloRegenerar');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.modalRef.close(this.ventasService);
  }

  buscarCliente(){
    console.log(this.factura.numeroDocumento)
    if(!this.factura.numeroDocumento){
      return ;
    }
    else {
      var comp;
      (this.factura.complemento)? comp = this.factura.complemento.toUpperCase():comp='';
      this.clientesService.buscarClienteCI(this.factura.numeroDocumento, comp, this.factura.codigoTipoDocumentoIdentidad).then(data=>{
        if (data.datos) {
          this.factura.nombreRazonSocial = data.datos.razon_social
        } else {
          this.factura.nombreRazonSocial = ""
        }
        this.validacionesRS();
      })
    }
  }

  validacionesRS(){
    if (!this.factura.nombreRazonSocial) 
     this.validacionRS = true;
    else
     this.validacionRS = false;
 }


  validarCaed(){
    console.log(this.factura.caed)
    if (this.factura.caed) {
      this.validacionCAED = false
    } else {
      this.validacionCAED = true
    }
  }

  validarNumF(){
    console.log(this.factura.numeroFactura)
    if (this.factura.numeroFactura) {
      this.validacionNF = false
    } else {
      this.validacionNF = true
    }
  }

  validarNit(){
    console.log(this.factura.numeroDocumento)
    if (this.factura.numeroDocumento) {
      this.validacionND = false
    } else {
      this.validacionND = true
    }
  }

  toggleVisibility(e){
    this.marked= e.target.checked;
    if (this.marked) {
      this.factura.codigoExcepcionDocumento = this.excepcion;
    } else {
      this.factura.codigoExcepcionDocumento = null;
    }
  }

}
