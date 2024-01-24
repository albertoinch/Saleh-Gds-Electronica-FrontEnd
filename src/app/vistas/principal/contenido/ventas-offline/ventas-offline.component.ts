import { Component, OnInit, ViewChild, ElementRef, Renderer2  } from '@angular/core';

import { VentasService } from '../../../../servicios/ventas.service';
import { FacturacionService } from '../../../../servicios/facturacion.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CatalogoService } from '../../../../servicios/catalogo.service';
//para descarga de factura
import { saveAs } from 'file-saver';
//para filtro de fechas
import {NgbDate, NgbCalendar, NgbInputDatepicker,NgbDateStruct,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgModel} from "@angular/forms";
const now = new Date();
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../../../servicios/usuario.service';
import { Rol } from '../../../../modelos/rol';

@Component({
  selector: 'app-ventas-offline',
  templateUrl: './ventas-offline.component.html',
  styleUrls: ['./ventas-offline.component.scss']
})
export class VentasOfflineComponent implements OnInit {

  constructor(private ventasService: VentasService,
    private facturacionService: FacturacionService,
    private alertService: AlertService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private _parserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService) { }

  public aVentas: any;
  limit: any;
  //variables de busqueda
  public buscarCliente: any;
  public buscarEstado: any;
  public buscarNroF: any;
  public fechaInicio ="";
  public fechaFin ="";

  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};
  //variable para filtros
  estado: boolean = false;
  cliente: boolean = false;
  nro_factura: boolean = false;
  fecha: boolean = false;
  monto: boolean = false;
  groupOptionsSelect: Array<any>;

  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  public idVenta: any;//->para modal

  //para anular
  motivo: any;
  listaMotivos:any;
  razon_social:any;
  nit:any;

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

  @ViewChild("d",{static: false}) input: NgbInputDatepicker;
  @ViewChild(NgModel,{static: false}) datePick: NgModel;
  @ViewChild('myRangeInput',{static: false}) myRangeInput: ElementRef;

  onDateSelection(date: NgbDate) {
     let parsed = '';
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      var mf = this.fromDate.month.toString()
      var mt = this.toDate.month.toString()
      if(mf.length ===1)
          mf = '0'+ mf
      if(mt.length ===1)
          mt = '0'+mt
      this.fechaInicio = this.fromDate.year+'-'+this.fromDate.month+'-'+ this.fromDate.day
      this.fechaFin = this.toDate.year+'-'+this.toDate.month+'-'+ this.toDate.day;
      this.paginar(1,this.buscarCliente,this.buscarEstado, this.buscarNroF, this.limit, this.fechaInicio.toString(), this.fechaFin.toString()+' 23:59:59')
      this.input.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if(this.fromDate) 
        parsed += this._parserFormatter.format(this.fromDate);
    if(this.toDate) 
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
      { value: 'VALIDADO', label: 'VALIDADO' },
      { value: 'ANULADO', label: 'ANULADO' },
      { value: 'OBSERVADO', label: 'OBSERVADO' },
      { value: 'RECHAZADO', label: 'RECHAZADO' }
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
    this.paginar(1,this.buscarCliente, this.buscarEstado, this.buscarNroF, this.limit, this.fechaInicio, this.fechaFin);

  }

  paginar(page: number, buscarC, buscarE, buscarF, limit, desde, hasta) { 
    if (page < 1 /*|| page > this.paginacion.totalPaginas */|| !page) {
        return;
    }

    (buscarC != undefined) ? "" :buscarC="";
    (!buscarE) ? buscarE="":"";
    (!buscarF) ? buscarF=0:"";
    if (new Date(desde).getTime() > new Date(hasta).getTime()) {
      this.alertService.danger( this.translate.instant('Error al introducir fechas'));
      return;
    }
    this.aVentas = [];
    this.ventasService.getVentasOffline(page, buscarC, buscarE, buscarF, limit, desde, hasta).then(data => {
      if (data.finalizado) {
        this.aVentas = data.datos;
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

  getAbrirPdf(idVenta) {
    this.ventasService.getAbrirPdf(idVenta, 'venta')
  }

  getDescargarPdf(idVenta) {
    const nombrePdf = `${idVenta}-venta.pdf`;
    this.ventasService.getDescargarPdf(idVenta, 'venta').subscribe(
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

    switch (caso) {
      //estado
      case 1:
        this.cliente = false;
        this.nro_factura = false;
        this.fecha = false;
        this.estado = true;
        break;
      //cliente
      case 2:
        this.nro_factura = false;
        this.estado = false;
        this.fecha = false;
        this.cliente = true;
        break;
      //nro factura
      case 3:
        this.cliente = false;
        this.estado = false;
        this.fecha = false;
        this.nro_factura = true;
        break;
      //fecha
      case 4:
        this.cliente = false;
        this.estado = false;
        this.nro_factura = false;
        this.fecha = true;
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
      this.paginar(1,this.buscarCliente, this.buscarEstado, this.buscarNroF, this.limit, this.fechaInicio, this.fechaFin);

  }

  buscar() {
    if (this.buscarCliente != "" || this.buscarNroF != 0 || this.buscarEstado != "" || this.model) {
      this.detalle(true);
    }
  }
  //cerrar filtro de busqueda
  close() {
    this.cliente = false;
    this.estado = false;
    this.nro_factura = false;
    this.fecha = false;

    this.buscarCliente = "";
    this.buscarEstado = "";
    this.buscarNroF = 0;
    this.model ="";
    this.fechaInicio  = "";
    this.fechaFin = "";
    this.paginar(1,this.buscarCliente, this.buscarEstado, this.buscarNroF, this.limit, this.fechaInicio, this.fechaFin);
  }

  getRol() {
    return this.usuarioService.getRol();
  }

  permiteCrear(){
    const currentRol= this.getRol();
    if (Rol.AdminFactura === currentRol) {
        return true;
    } else
      return false;
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
        this.catalogoService.getMotivoAnulacion().then(data=>{
          this.listaMotivos = data.datos
        });
        /* this.ventasService.getMotivos().then(data=>{
            this.listaMotivos = data.datos
        }); */
        this.razon_social = dato1;
        this.nit = dato2;
        break;
      case 'paquete':
        this.modalTitulo = this.translate.instant('modal.enviarPaquete');

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
    this.listaMotivos = null;
    this.razon_social = null;
    this.nit = null;
    this.modalData = [];
    this.modalRef.close(this.ventasService);
  }

  anularVenta(idVenta) {
    var datos = {
      motivo: parseInt(this.motivo)
    }
    this.ventasService.anularVenta(idVenta, datos).then(anular => {
      if (anular.finalizado) {
        this.alertService.success(
          this.translate.instant('mensaje.ventas.anuladaExitosa')
        );
        this.actualizarDatos();
      } else {
        this.alertService.danger(
          this.translate.instant(anular.error.mensaje)
        );
      }
    }).catch(e=>{
      console.log("------ eror anular ",e)
    });
  }

  /* regenerarFactura(idVenta) {
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

  enviarPaquete(){
    this.ventasService.postPaquete().then(data =>{
      if (data.finalizado) {
        this.alertService.success( this.translate.instant(data.mensaje));
      }else{
        this.alertService.danger( this.translate.instant(data.error.mensaje));
      }
    }).catch(error=>{
        this.alertService.danger( this.translate.instant(error));
    })
  }

  getAbrirPdf2(idVenta) {
    this.ventasService.getAbrirPdf(idVenta, 'ventas_pdf')
  }

}
