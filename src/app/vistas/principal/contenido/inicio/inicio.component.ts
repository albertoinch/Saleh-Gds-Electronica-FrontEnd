import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';//ViewChild,ElementRef, Renderer2--> para fechas

import { VentasService } from '../../../../servicios/ventas.service';
import { FacturacionService } from '../../../../servicios/facturacion.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para descarga de factura
import { saveAs } from 'file-saver';
//para filtro de fechas
import { NgbDate, NgbCalendar, NgbInputDatepicker, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from "@angular/forms";
const now = new Date();
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CatalogoService } from '../../../../servicios/catalogo.service';
// Para control de roles
import { UsuarioService } from '../../../../servicios/usuario.service';
import { Rol } from '../../../../modelos/rol';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(private ventasService: VentasService,
    private facturacionService: FacturacionService,
    private alertService: AlertService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private _parserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService,) { }
  public aVentas: any;
  limit: any;
  //variables de busqueda
  public buscarNit: any;
  public buscarCliente: any;
  public buscarEstado: any;
  public buscarNroF: any;
  public fechaInicio = "";
  public fechaFin = "";
  public buscarTipoEmision: any;
  public buscarPost: any;

  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282 };
  //variable para filtros
  estado: boolean = false;
  cliente: boolean = false;
  nro_nit: boolean = false;
  nro_factura: boolean = false;
  fecha: boolean = false;
  monto: boolean = false;
  tipoEmi: boolean = false;
  groupOptionsSelect: Array<any>;
  tipoEmision: Array<any>;
  post: boolean = false;

  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  public idVenta: any;//->para modal

  //para anular
  motivo: any;
  descripcion: any;
  listaMotivos: any;
  razon_social: any;
  nit: any;

  //para regenrar
  groupOptionsRegenera: Array<any>;
  tipoE: any;

  //para busqueda de fechas
  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  model: any;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;

  //public email:any;


  @ViewChild("d", { static: false }) input: NgbInputDatepicker;
  @ViewChild(NgModel, { static: false }) datePick: NgModel;
  @ViewChild('myRangeInput', { static: false }) myRangeInput: ElementRef;

  onDateSelection(date: NgbDate) {
    let parsed = '';
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      var mf = this.fromDate.month.toString()
      var mt = this.toDate.month.toString()
      if (mf.length === 1)
        mf = '0' + mf
      if (mt.length === 1)
        mt = '0' + mt
      this.fechaInicio = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day
      this.fechaFin = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day + ' 23:59:59';
      this.paginar(1, this.buscarNit, this.buscarCliente, this.buscarEstado, this.buscarNroF, this.limit, this.fechaInicio.toString(), this.fechaFin.toString(), this.buscarTipoEmision, this.buscarPost)
      this.input.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate)
      parsed += this._parserFormatter.format(this.fromDate);
    if (this.toDate)
      parsed += ' - ' + this._parserFormatter.format(this.toDate);
    this.renderer.setProperty(this.myRangeInput.nativeElement, 'value', parsed);
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  ngOnInit() {
    this.aVentas = [];
    this.actualizarDatos();
    this.groupOptionsSelect = [
      { value: 'ENVIADO', label: 'ENVIADO' },
      { value: 'VALIDADO', label: 'VALIDADO' },
      { value: 'PENDIENTE', label: 'PENDIENTE' },
      { value: 'RECHAZADO', label: 'RECHAZADO' },
      { value: 'ANULADO', label: 'ANULADO' }
    ];
    this.tipoEmision = [
      { value: 1, label: 'EN LÍNEA' },
      { value: 2, label: 'FUERA DE LÍNEA' },
      { value: 3, label: 'EN LÍNEA MASIVA' }
    ];
  }

  actualizarDatos() {
    this.aVentas = [];
    this.buscarCliente = "";
    this.buscarEstado = "";
    this.buscarNroF = 0;
    this.limit = 10;
    this.fechaInicio = "";
    this.fechaFin = "";
    this.buscarTipoEmision = "1";
    this.model = "";
    this.close();
    this.paginar(1, this.buscarNit, this.buscarCliente, this.buscarEstado, this.buscarNroF, this.limit, this.fechaInicio, this.fechaFin, this.buscarTipoEmision, this.buscarPost);
  }

  paginar(page: number, buscarN, buscarC, buscarE, buscarF, limit, desde, hasta, tipoE, post) {
    if (page < 1 /*|| page > this.paginacion.totalPaginas */ || !page) {
      return;
    }

    (buscarN != undefined) ? "" : buscarN = "";
    (buscarC != undefined) ? "" : buscarC = "";
    (!buscarE) ? buscarE = "" : "";
    //(!buscarF) ? buscarF=0:"";
    (!buscarF) ? buscarF = "" : "";
    //if (desde>hasta) {
    if (new Date(desde).getTime() > new Date(hasta).getTime()) {
      this.alertService.danger(this.translate.instant('Error al introducir fechas'));
      return;
    }
    this.aVentas = [];
    this.ventasService.getVentas(page, buscarN, buscarC, buscarE, buscarF, limit, desde, hasta, tipoE, post).then(data => {
      if (data.finalizado) {
        this.aVentas = data.datos;
        this.paginacion.total = data.paginacion.totalRegistros;
        this.paginacion.cantidad = data.paginacion.cantidad;
        this.paginacion.totalPaginas = data.paginacion.paginas;
        this.paginacion.paginaActual = parseInt(data.paginacion.paginaActual);
      } else {
        this.alertService.danger(this.translate.instant(data.error.mensaje));
      }
    }).catch(error => {
      this.alertService.danger(this.translate.instant(error));
    });
  }

  getAbrirPdf(idVenta) {
    //this.ventasService.getAbrirPdf(idVenta, 'venta')
    this.ventasService.getAbrirPdf(idVenta, 'factura')
  }

  getAbrirXml(cuf) {
    this.ventasService.getAbrirXml(cuf, '../../factura')
  }

  getDescargarPdf(idVenta) {
    const nombrePdf = `${idVenta}-venta.pdf`;
    //this.ventasService.getDescargarPdf(idVenta, 'venta').subscribe(
    this.ventasService.getDescargarPdf(idVenta, 'factura').subscribe(
      pdfVenta => {
        saveAs(pdfVenta, nombrePdf);
      },
      err => {
        if (err['error']) {
          this.alertService.info(err['error']);
        }
      }
    );
  }

  casoBusqueda(caso) {
    this.buscarCliente = "";
    this.buscarNroF = 0;
    this.buscarEstado = "";
    this.fechaInicio = "";
    this.fechaFin = "";
    this.buscarTipoEmision = "1";

    switch (caso) {
      //estado
      case 1:
        this.nro_nit = false;
        this.cliente = false;
        this.nro_factura = false;
        this.fecha = false;
        this.estado = true;
        this.tipoEmi = false;
        this.post = false;
        break;
      //cliente
      case 2:
        this.nro_nit = false;
        this.nro_factura = false;
        this.estado = false;
        this.fecha = false;
        this.cliente = true;
        this.tipoEmi = false;
        this.post = false;
        break;
      //nro factura
      case 3:
        this.nro_nit = false;
        this.cliente = false;
        this.estado = false;
        this.fecha = false;
        this.nro_factura = true;
        this.tipoEmi = false;
        this.post = false;
        break;
      //fecha
      case 4:
        this.nro_nit = false;
        this.cliente = false;
        this.estado = false;
        this.nro_factura = false;
        this.fecha = true;
        this.tipoEmi = false;
        this.post = false;
        break;
      //tipo emision
      case 5:
        this.nro_nit = false;
        this.cliente = false;
        this.estado = false;
        this.nro_factura = false;
        this.fecha = false;
        this.tipoEmi = true;
        this.post = false;
        break;
      case 6:
        this.nro_nit = true;
        this.cliente = false;
        this.estado = false;
        this.nro_factura = false;
        this.fecha = false;
        this.tipoEmi = false;
        this.post = false;
        break;
      case 7:
        this.nro_nit = false;
        this.cliente = false;
        this.estado = false;
        this.nro_factura = false;
        this.fecha = false;
        this.tipoEmi = false;
        this.post = true;
        break;
      default:
    }
  }

  detalle(filtro) {
    /*if (!filtro) {
      this.buscarCliente = false;
      this.buscarEstado = false;
      this.buscarNroF = false;
      this.fecha = false;
    }*/
    this.paginar(1, this.buscarNit, this.buscarCliente, this.buscarEstado, this.buscarNroF, this.limit, this.fechaInicio, this.fechaFin, this.buscarTipoEmision, this.buscarPost);

  }

  buscar() {
    if (this.buscarNit != "" || this.buscarCliente != "" || this.buscarNroF != 0 || this.buscarEstado != "" || this.model || this.buscarTipoEmision || this.buscarPost) {
      this.detalle(true);
    }
  }
  buscar2() {
    this.post = true;
    this.buscarPost = true;
    this.buscar();
  }
  //cerrar filtro de busqueda
  close() {
    this.nro_nit = false;
    this.cliente = false;
    this.estado = false;
    this.nro_factura = false;
    this.fecha = false;
    this.tipoEmi = false;
    this.post = false;

    this.buscarNit = "";
    this.buscarCliente = "";
    this.buscarEstado = "";
    this.buscarNroF = 0;
    this.model = "";
    this.fechaInicio = "";
    this.fechaFin = "";
    this.buscarTipoEmision = "1";
    this.buscarPost = "";
    this.paginar(1, this.buscarNit, this.buscarCliente, this.buscarEstado, this.buscarNroF, this.limit, this.fechaInicio, this.fechaFin, this.buscarTipoEmision, this.buscarPost);
  }

  getRol() {
    return this.usuarioService.getRol();
  }

  permiteCrear() {
    var crear = false;
    const currentRol = this.getRol();
    if (Rol.AdminFactura === currentRol || Rol.Admin === currentRol) {
      crear = true
    } else {
      crear = false;
    }
    return crear
  }

  abrirModal(plantilla, aData, seccion, dato1, dato2) {
    this.modalSeccion = seccion;
    this.modalData = aData;
    this.idVenta = null;
    switch (seccion) {
      case 'regenerar':
        this.modalTitulo = this.translate.instant('modal.tituloRegenera');
        this.idVenta = aData.id_venta;
        this.groupOptionsRegenera = [
          { value: 1, label: 'ON LINE' },
          { value: 2, label: 'OFF LINE' }
        ];
        break;
      case 'anular':
        this.modalTitulo = this.translate.instant('modal.anularFactura');
        this.idVenta = aData.id_venta;
        /* this.ventasService.getMotivos().then(data=>{
            this.listaMotivos = data.datos
        }); */
        this.catalogoService.getMotivoAnulacion().then(data => {
          this.listaMotivos = data.datos
        });
        this.razon_social = dato1;
        this.nit = dato2;
        break;
      case 'paquete':
        this.modalTitulo = this.translate.instant('modal.enviarPaquete');
        break;
      case 'correo':
        this.modalTitulo = this.translate.instant('Enviar factura a correo');
        this.razon_social = dato1;
        this.nit = dato2;
        this.idVenta = aData.id_venta;
      case 'observados':
        this.modalTitulo = this.translate.instant('Observaciones de factura');
        //this.modalData = JSON.stringify(JSON.parse(aData));
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
    this.idVenta = null;
    this.motivo = null;
    this.descripcion = null;
    this.listaMotivos = null;
    this.razon_social = null;
    this.nit = null;
    this.modalData = [];
    this.modalRef.close(this.ventasService);
  }

  anularVenta(idVenta) {
    var datos = {
      //motivo: parseInt(this.motivo)
      codigo: parseInt(this.motivo)
    }
    this.ventasService.anularVenta(idVenta, { codigo: parseInt(this.motivo), motivo: this.descripcion }).then(anular => {
      if (anular.finalizado) {
        this.alertService.success(
          this.translate.instant('mensaje.ventas.anuladaExitosa')
        );
        if (this.buscarCliente || this.model || this.buscarEstado || this.buscarNroF || this.buscarTipoEmision) {
          this.close()
        }
        this.actualizarDatos();
      } else {
        this.alertService.danger(
          this.translate.instant(anular.error.mensaje)
        );
      }
    }).catch(e => {
      console.log("------ error anular ", e)
    });
  }

  /*  regenerarFactura(idVenta) {
     var datos = {
       tipoEmision: parseInt(this.tipoE)
     }
     this.facturacionService.regenerarVenta(idVenta, datos).then(anular => {
       if (anular.finalizado) {
         this.alertService.success(
           this.translate.instant('mensaje.ventas.regeneraExito')
         );
         this.actualizarDatos();
       }
     }).catch(e=>{
       console.log("------ error anular ",e)
     });
   } */

  enviarPaquete() {
    this.ventasService.postPaquete().then(data => {
      if (data.finalizado) {
        this.alertService.success(this.translate.instant(data.mensaje));
      } else {
        this.alertService.danger(this.translate.instant(data.error.mensaje));
      }
    }).catch(error => {
      this.alertService.danger(this.translate.instant(error));
    })
  }

  getAbrirPdf2(idVenta) {
    this.ventasService.getAbrirPdf(idVenta, 'ventas_pdf')
  }

}
