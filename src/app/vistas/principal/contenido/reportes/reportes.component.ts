import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../../../servicios/eventos.service';
import { VentasService } from '../../../../servicios/ventas.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CatalogoService } from '../../../../servicios/catalogo.service';
//para reportes
// declare var jsPDF: any;
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})


export class ReportesComponent implements OnInit {

  constructor(private eventosService: EventosService,
    private ventasService: VentasService,
    private alertService: AlertService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private catalogoService: CatalogoService) { }

  lista: any;
  total: number;
  nic: number;
  certificado: number;
  limit: any;
  //variables de busqueda
  desde: any;
  hasta: any;
  buscarEstado: any;
  buscarNroCliente: any;
  buscarTipoDoc: any;

  //variables de reportes 
  buscarReporteT:any;
  groupOptionsSelect: Array<any>;
  valor:any;
  titulo:any;
  boolEventos:boolean =false;
  boolSalud:boolean =false;
  boolCertificacion:boolean =false;
  boolEmitidos:boolean =false;
  boolAnulados:boolean =false;
  boolTotal:boolean =false;
  boolBusqueda:boolean =false;
  boolBusquedaV:boolean =false;
  boolBusquedaS:boolean =false;
  groupTiposDoc: Array<any>;
  cantidad: Array<any>;
  public today = new Date();
  boolCantidad:boolean =false;
  boolResumenV:boolean =false;

  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};
  fechaDesde:any;
  fechaHasta:any;
  anios:Array<any>;

  ngOnInit() {
    // this.boolEventos = false;
    // this.boolSalud = false;
    // this.boolCertificacion = false;
    // this.boolEmitidos = false;
    // this.boolAnulados = false;
    // this.boolTotal = false;
    // this.boolBusqueda = false;
    this.limit = 1000000;
    this.anios=[];

    this.groupOptionsSelect = [
      //{ value: 'EVENTOS', label: 'Eventos Significativos' },
      //{ value: 'ESTADO DE SALUD', label: 'Estado de salud del Sistema de Facturación' },
      //{ value: 'CERTIFICACION', label: 'Certificación del Sistema de Facturación' },
      { value: 'FACTURAS EMITIDAS', label: 'Facturas Emitidas' },
      { value: 'FACTURAS ANULADAS', label: 'Facturas Anuladas' },
      //{ value: 'ESTADO DE ENVIO DE FACTURAS', label: 'Estado de envío de Facturas' },
      { value: 'RESUMEN VENTAS', label: 'Resumen de ventas en el periodo' }
    ];
    var anio = new Date().getFullYear();
    for (let i = 0; i < 15; i++) {
      this.anios.push(anio--);
    }
    console.log(this.anios)
  }

  buscarRepTipo(valor){
    this.boolEventos = false;
    this.boolSalud = false;
    this.boolCertificacion = false;
    this.boolEmitidos = false;
    this.boolAnulados = false;
    this.boolTotal = false;
    this.boolBusqueda = false;
    this.boolBusquedaV = false;
    this.boolBusquedaS = false;
    //variable de busqueda tipo reporte
    this.valor = valor;
    //variables de busqueda en formulario
    this.desde = "";
    this.hasta = "";
    this.buscarEstado ="";
    this.buscarNroCliente ="";
    this.buscarTipoDoc ="";
    this.paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};

    switch (this.valor) {
      case "EVENTOS":
        this.boolEventos = true;
        this.boolSalud = false;
        this.boolCertificacion = false;
        this.boolEmitidos = false;
        this.boolAnulados = false;
        this.boolTotal = false;
        this.boolResumenV = false;
        this.titulo = "Eventos Significativos"
        break;
      case "ESTADO DE SALUD":
        this.boolEventos = false;
        this.boolSalud = true;
        this.boolCertificacion = false;
        this.boolEmitidos = false;
        this.boolAnulados = false;
        this.boolTotal = false;
        this.boolResumenV = false;
        this.titulo = "Esatado de Salud"
        break;
      case "CERTIFICACION":
        this.boolEventos = false;
        this.boolSalud = false;
        this.boolCertificacion = true;
        this.boolEmitidos = false;
        this.boolAnulados = false;
        this.boolTotal = false;
        this.boolResumenV = false;
        this.titulo = "Certificación de Sistema"
        break;
      case "FACTURAS EMITIDAS":
        this.boolEventos = false;
        this.boolSalud = false;
        this.boolCertificacion = false;
        this.boolEmitidos = true;
        this.boolAnulados = false;
        this.boolTotal = false;
        this.boolResumenV = false;
        this.catalogoService.getTipoDocumentoFiscal().then(data => {
          this.groupTiposDoc = data.datos
        });
        /* this.ventasService.getTipoDocumentos().then(data => {
          this.groupTiposDoc = data.datos
        }); */
        this.titulo = "Facturas Emitidas";
        break;
      case "FACTURAS ANULADAS":
        this.boolEventos = false;
        this.boolSalud = false;
        this.boolCertificacion = false;
        this.boolEmitidos = false;
        this.boolAnulados = true;
        this.boolTotal = false;
        this.boolResumenV = false;
        this.catalogoService.getTipoDocumentoFiscal().then(data => {
          this.groupTiposDoc = data.datos
        });
        /* this.ventasService.getTipoDocumentos().then(data => {
          this.groupTiposDoc = data.datos
        }) */
        this.titulo = "Facturas Anuladas"
        break;
       case "ESTADO DE ENVIO DE FACTURAS":
        this.boolEventos = false;
        this.boolSalud = false;
        this.boolCertificacion = false;
        this.boolEmitidos = false;
        this.boolAnulados = false;
        this.boolTotal = true;
        this.boolResumenV = false;
        this.titulo = "Estado de Envío de Facturas"
        break;
       case "RESUMEN VENTAS":
        this.boolEventos = false;
        this.boolSalud = false;
        this.boolCertificacion = false;
        this.boolEmitidos = false;
        this.boolAnulados = false;
        this.boolTotal = false;
        this.boolResumenV = true;
        this.titulo = "Resumen de ventas por periodo"
        break;
      default:
        break;
    }
  }

  buscarReporte(){
    if(this.desde && this.hasta){
        this.fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
        this.fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`;
        if (new Date(this.fechaDesde).getTime() > new Date(this.fechaHasta).getTime()) {
          this.alertService.danger( this.translate.instant('Error al introducir fechas'));
          return;
        }
        this.boolBusqueda = true;
        switch (this.valor) {
          case "EVENTOS":
            this.eventosService.getRepEventos(this.limit, this.fechaDesde, this.fechaHasta).then(data=>{
              if (data.finalizado) {
                this.lista = data.datos;
                this.paginacion.total = data.paginacion.totalRegistros;
                this.boolCantidad = false;
              } else {
                this.alertService.danger( this.translate.instant(data.error.mensaje));
              }
            })
            break;
          case "ESTADO DE SALUD":
            this.eventosService.getEventosSaludReporte(this.fechaDesde, this.fechaHasta).then(data=>{
              if (data.finalizado) {
                this.lista = data.datos;
                if (this.lista.length === 0 ) {
                  this.boolBusquedaS = true;
                  this.paginacion.total = 0;
                  this.alertService.danger(
                    this.translate.instant('No se encontraron resultados')
                  );
                } else {
                  this.boolBusquedaS = true;
                }
                this.boolCantidad = false;
                this.boolBusqueda = false;
              } else {
                this.alertService.danger( this.translate.instant(data.error.mensaje));
              }
            })
            break;
          case "CERTIFICACION":
            break;
          case "FACTURAS EMITIDAS":
            this.buscarEstado = 'VALIDADO';
            if (!this.buscarNroCliente) {
              this.buscarNroCliente = ""
            }   

            this.ventasService.getRepVentasEmitidas(this.limit, this.fechaDesde, this.fechaHasta, this.buscarEstado, this.buscarNroCliente, this.buscarTipoDoc).then(data =>{
              if (data.finalizado) {
                this.lista = data.datos;
                this.total = data.total;
                this.nic = data.nic;
                this.certificado = data.certificado;
                this.paginacion.total = data.paginacion.totalRegistros;
                this.boolCantidad = false;
              } else {
                this.alertService.danger( this.translate.instant(data.error.mensaje));
              }
            })
            break;
          case "FACTURAS ANULADAS":
            this.buscarEstado = 'ANULADO';
            if (!this.buscarNroCliente) {
              this.buscarNroCliente = ""
            }
             
            this.ventasService.getRepVentasEmitidas(this.limit, this.fechaDesde, this.fechaHasta, this.buscarEstado, this.buscarNroCliente, this.buscarTipoDoc).then(data =>{
              if (data.finalizado) {
                this.lista = data.datos;
                this.total = data.total;
                this.nic = data.nic;
                this.certificado = data.certificado;
                this.paginacion.total = data.paginacion.totalRegistros;
                this.boolCantidad = false;
              } else {
                this.alertService.danger( this.translate.instant(data.error.mensaje));
              }
            })
            break;
           case "ESTADO DE ENVIO DE FACTURAS":
             this.ventasService.getRepVentasCantidadSP( this.fechaDesde, this.fechaHasta).then(data =>{
              if (data.finalizado) {
                this.lista = data.datos;
                if (this.lista.length ===0 ) {
                  this.boolBusqueda = true;
                  this.boolCantidad = false;
                  this.paginacion.total = 0;
                  this.alertService.danger(
                    this.translate.instant('No se encontraron resultados')
                  );
                } else {
                  this.boolBusqueda = true;
                  this.boolCantidad = true;
                }
                //this.paginacion.total = data.paginacion.totalRegistros;
              } else {
                this.alertService.danger( this.translate.instant(data.error.mensaje));
              }
            })
            break;
           case "RESUMEN VENTAS":
             this.ventasService.getVentasPorPeriodo( this.fechaDesde, this.fechaHasta).then(data =>{
              if (data.finalizado) {
                this.lista = data.datos;
                console.log(this.lista)
                if (this.lista.length === 0 ) {
                  this.boolBusquedaV = true;
                  this.paginacion.total = 0;
                  this.alertService.danger(
                    this.translate.instant('No se encontraron resultados')
                  );
                } else {
                  this.boolBusquedaV = true;
                }
                //this.paginacion.total = data.paginacion.totalRegistros;
              } else {
                this.alertService.danger( this.translate.instant(data.error.mensaje));
              }
            });
            this.boolBusqueda = false;
          default:
            break;
        }
    } else {
       this.alertService.danger( this.translate.instant('Debe Introducir las fechas'));
       return;
    }
  }

  generaPDF(){
    if(this.desde && this.hasta){
      /* var fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
      var fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`; */
        if (new Date(this.fechaDesde).getTime() > new Date(this.fechaHasta).getTime()) {
          this.alertService.danger( this.translate.instant('Error al introducir fechas'));
          return;
        }
        //this.boolBusqueda = true;
        switch (this.valor) {
          case "EVENTOS":
            this.pdfEventos();
            break;
          case "ESTADO DE SALUD":
            this.pdfSalud();
            break;
          case "CERTIFICACION":
            break;
          case "FACTURAS EMITIDAS":
            if (!this.buscarTipoDoc) {
              if (!this.buscarNroCliente) {
                this.pdfVentas('VALIDADO');
              } else {
                this.pdfVentasPorCliente('VALIDADO');
              }
            } else {
              if (!this.buscarNroCliente) {
                this.pdfVentasTipoDoc('VALIDADO');
              } else {
                this.pdfVentasPorCliente('VALIDADO');
              }
            }
            break;
          case "FACTURAS ANULADAS":
            if (!this.buscarTipoDoc) {
              this.pdfVentas('ANULADO');
            } else {
              this.pdfVentasTipoDoc('ANULADO');
            }
            break;
           case "ESTADO DE ENVIO DE FACTURAS":
             this.pdfCantidades();
            break;
          case "RESUMEN VENTAS":
            this.pdfResumenVentas();
          break;
          default:
            break;
        }
    }
  }

  pdfEventos(){
    var columns = [
      {header:"Sucursal", dataKey:"punto_venta"},
      {header:"Codigo Evento", dataKey:"codigo_evento"},
      {header:"Fecha Inicio", dataKey:"fecha_inicio"},
      {header:"Fecha Fin", dataKey:"fecha_fin"},
      {header:"Descripción Evento", dataKey:"descripcion"}
    ];
    var doc = new jsPDF('l', 'pt','letter');
    var totalPagesExp = "{total_pages_count_string}";
    var lista = [];
    var fechaactual =this.datePipe.transform(this.today, 'dd/MM/yyyy hh:mm a');

    var user = localStorage.getItem('usuario');
    var fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
    var fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`;

    this.eventosService.getRepEventosSP(fechaDesde, fechaHasta).then(data => {
        lista = data.datos;
        if (data.datos.length > 0) { 
        for (var i = lista.length - 1; i >= 0; i--) {
          lista[i].fecha_inicio= this.datePipe.transform(lista[i].fecha_inicio, 'dd/MM/yyyy hh:mm a');
          lista[i].fecha_fin= this.datePipe.transform(lista[i].fecha_fin, 'dd/MM/yyyy hh:mm a');
        }  
        fechaDesde =this.datePipe.transform(fechaDesde, 'dd/MM/yyyy'); 
        fechaHasta =this.datePipe.transform(fechaHasta, 'dd/MM/yyyy'); 


        doc.autoTable(columns,lista,{
          didParseCell: function(data) {
               if (data.column.dataKey === 'punto_venta') {
                 if (data.cell.raw != 'Sucursal') {
                   data.cell.text = data.cell.raw.nombre
                 }
               }
           },
          theme: 'grid',
          didDrawPage: function (data) {
              doc.setFontSize(20);
              doc.setTextColor(40);
              doc.setFontStyle('normal');
              doc.setFillColor(90, 50, 52);
              doc.setFontSize(20);
              doc.setFontStyle('bold');
              doc.text("Reporte de Eventos Significativos", data.settings.margin.left + 220, 42);
              doc.setFontStyle('normal');
              doc.setFontSize(12);
              doc.setFontStyle('bold');
              doc.text("Fecha del reporte: ",data.settings.margin.left , 60);
              doc.setFontStyle('normal');
              doc.text(fechaactual,data.settings.margin.left+110 , 60);
              doc.setFontStyle('bold');
              doc.text("Usuario: ",data.settings.margin.left , 73);
              doc.setFontStyle('normal');
              doc.text(user,data.settings.margin.left+50 , 73);
              if(fechaDesde && fechaHasta){
                doc.setFontSize(12);
                doc.setFontStyle('bold');
                //doc.text("Reporte del: " +fechaDesde+" al "+fechaHasta, data.settings.margin.left , 87);
                doc.text("Reporte del: ", data.settings.margin.left , 87);
                doc.setFontStyle('normal');
                doc.text(fechaDesde, data.settings.margin.left +75, 87);
                doc.setFontStyle('bold');
                doc.text(" al ", data.settings.margin.left+ 135, 87);
                doc.setFontStyle('normal');
                doc.text(fechaHasta, data.settings.margin.left+155 , 87);
              }
              // Footer
              var str = "Página " + doc.internal.getNumberOfPages()
              // Total page number 
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              doc.setFillColor(90, 50, 52);
              doc.setFontSize(10);
              doc.setFontStyle('normal');

              var pageSize = doc.internal.pageSize;
              var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
              doc.text(str, data.settings.margin.left, pageHeight - 10);
          },
          headStyles: {
            fillColor: [90, 50, 52],
            //fillColor: [81, 108, 141],
            valign: 'middle',
          },
          styles: {overflow: 'linebreak', cellWidth:'wrap'},
           columnStyles: {
             text: {
                  cellWidth: 'wrap'
              },
              sucursal: {
                  cellWidth: 'auto',      
              },
              codigo_evento: {
                  cellWidth: 20
              },
              fecha_inicio: {
                  cellWidth: 45
              },
              fecha_fin: {
                  cellWidth: 45
              },
              descripcion: {
                  cellWidth: 'auto'
              }
          },
          margin: {
            top: 96
          }
        });
         // numero de paginas totales
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.setProperties({
          title: 'Reporte de Eventos',
        });
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
       // doc.save("Eventos"+ new  Date().getTime()+".pdf");
     } else {
       this.paginacion.total = 0
     }
      }).catch(error=>{
        this.alertService.danger(
          this.translate.instant('Ocurrio un error '+error)
        );
        console.log("error ---------------->",error)
      });
  }


  pdfVentas(estado){
    if (!this.buscarEstado) {
      this.buscarEstado = estado
    }
    if (!this.buscarNroCliente) {
      this.buscarNroCliente = ""
    } 
    if (!this.buscarTipoDoc) {
      this.buscarTipoDoc = ""
    }
    var columns = [
      {header:"Fecha Emisión", dataKey:"fecha_emision"},
      {header:"Tipo Documento", dataKey:"tipo_factura"},
      {header:"Nro. Documento", dataKey:"numero_factura"},
      {header:"Nombre/Razón Social", dataKey:"nombre_razon_social"},
      {header:"Nro. Doc. Cliente", dataKey:"numero_documento"},
      {header:"Monto (Bs.)", dataKey:"monto"},
      {header:"Estado", dataKey:"estado"}
    ];
    var doc = new jsPDF('l', 'pt','letter');
    var totalPagesExp = "{total_pages_count_string}";
    var lista = [];
    var fechaactual =this.datePipe.transform(this.today, 'dd/MM/yyyy hh:mm a');

    var user = localStorage.getItem('usuario');
    var fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
    var fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`, tit;
    if (estado === 'ANULADO') {
      tit = 'Anuladas'
    } else {
      tit = 'Emitidas'
    }

     this.ventasService.getRepVentasEmitidasSP(fechaDesde, fechaHasta, this.buscarEstado, this.buscarNroCliente, this.buscarTipoDoc);
  }

  pdfVentasTipoDoc(estado){
    if (!this.buscarEstado) {
      this.buscarEstado = estado
    }
    if (!this.buscarNroCliente) {
      this.buscarNroCliente = ""
    } 
    if (!this.buscarTipoDoc) {
      this.buscarTipoDoc = ""
    }
    var columns = [
      {header:"Fecha Emisión", dataKey:"fecha_emision"},
      {header:"Nro. Documento", dataKey:"numero_factura"},
      {header:"Nombre/Razón Social", dataKey:"nombre_razon_social"},
      {header:"Nro. Documento Cliente", dataKey:"fid_cliente"},
      {header:"Monto", dataKey:"monto"},
      {header:"Estado", dataKey:"estado"}
    ];
    var doc = new jsPDF('l', 'pt','letter');
    var totalPagesExp = "{total_pages_count_string}";
    var lista = [];
    var fechaactual =this.datePipe.transform(this.today, 'dd/MM/yyyy hh:mm a');

    var user = localStorage.getItem('usuario');
    var fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
    var fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`;


    this.ventasService.getRepVentasEmitidasSP(fechaDesde, fechaHasta, this.buscarEstado, this.buscarNroCliente, this.buscarTipoDoc);
  }

  buscaTipoDocVal(valor){
    for (var i = this.groupTiposDoc.length - 1; i >= 0; i--) {
      if (valor === this.groupTiposDoc[i].codigo) {
        return this.groupTiposDoc[i].descripcion
      }
    }
  }

  pdfVentasPorCliente(estado){
    if (!this.buscarEstado) {
      this.buscarEstado = estado
    }
    if (!this.buscarNroCliente) {
      this.buscarNroCliente = ""
    } 
    if (!this.buscarTipoDoc) {
      this.buscarTipoDoc = ""
    }
    var columns = [
      {header:"Fecha Emisión", dataKey:"fecha_emision"},
      {header:"Tipo Documento", dataKey:"caed"},
      {header:"Nro. Documento", dataKey:"numero_factura"},
      {header:"Monto", dataKey:"monto"},
      {header:"Estado", dataKey:"estado"}
    ];
    var doc = new jsPDF('l', 'pt','letter');
    var totalPagesExp = "{total_pages_count_string}";
    var lista = [];
    var fechaactual =this.datePipe.transform(this.today, 'dd/MM/yyyy hh:mm a');

    var user = localStorage.getItem('usuario');
    var fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
    var fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`;

    this.ventasService.getRepVentasEmitidasSP(fechaDesde, fechaHasta, this.buscarEstado, this.buscarNroCliente, this.buscarTipoDoc);
  }

  pdfCantidades(){
    var columns = [
      {header:"Descripción", dataKey:"estado"},
      {header:"Cantidad", dataKey:"cantidad"}
    ];
    var doc = new jsPDF('l', 'pt','letter');
    var totalPagesExp = "{total_pages_count_string}";
    var lista = [];
    var fechaactual =this.datePipe.transform(this.today, 'dd/MM/yyyy hh:mm a');

    var user = localStorage.getItem('usuario');
    var fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
    var fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`;

    this.ventasService.getRepVentasCantidadSP( fechaDesde, fechaHasta).then(data =>{
        lista = data.datos;
        if (data.datos.length > 0) { 
 
        fechaDesde =this.datePipe.transform(fechaDesde, 'dd/MM/yyyy'); 
        fechaHasta =this.datePipe.transform(fechaHasta, 'dd/MM/yyyy'); 


        doc.autoTable(columns,lista,{
          didParseCell: function(data) {
               if (data.column.dataKey === 'sucursal') {
                 if (data.cell.raw != 'Sucursal') {
                   data.cell.text= data.cell.raw.nombre
                 }
               }
           },
          theme: 'grid',
          didDrawPage: function (data) {
              doc.setFontSize(20);
              doc.setTextColor(40);
              doc.setFontStyle('normal');
              doc.setFillColor(90, 50, 52);
              doc.setFontSize(20);
              doc.setFontStyle('bold');
              doc.text("Estado de envío de Facturas", data.settings.margin.left + 220, 42);
              doc.setFontStyle('normal');
              doc.setFontSize(12);
              doc.setFontStyle('bold');
              doc.text("Fecha del reporte: ",data.settings.margin.left , 60);
              doc.setFontStyle('normal');
              doc.text(fechaactual,data.settings.margin.left+110 , 60);
              doc.setFontStyle('bold');
              doc.text("Usuario: ",data.settings.margin.left , 73);
              doc.setFontStyle('normal');
              doc.text(user,data.settings.margin.left+50 , 73);
              if(fechaDesde && fechaHasta){
                doc.setFontSize(12);
                doc.setFontStyle('bold');
                //doc.text("Reporte del: " +fechaDesde+" al "+fechaHasta, data.settings.margin.left , 87);
                doc.text("Reporte del: ", data.settings.margin.left , 87);
                doc.setFontStyle('normal');
                doc.text(fechaDesde, data.settings.margin.left +75, 87);
                doc.setFontStyle('bold');
                doc.text(" al ", data.settings.margin.left+ 135, 87);
                doc.setFontStyle('normal');
                doc.text(fechaHasta, data.settings.margin.left+155 , 87);
              }
              // Footer
              var str = "Página " + doc.internal.getNumberOfPages()
              // Total page number 
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              doc.setFillColor(90, 50, 52);
              doc.setFontSize(10);
              doc.setFontStyle('normal');

              var pageSize = doc.internal.pageSize;
              var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
              doc.text(str, data.settings.margin.left, pageHeight - 10);
          },
          headStyles: {
            fillColor: [90, 50, 52],
            //fillColor: [81, 108, 141],
            valign: 'middle',
          },
          styles: {overflow: 'linebreak', cellWidth:'wrap'},
           columnStyles: {
             text: {
                  cellWidth: 'wrap'
              },
              estado: {
                  cellWidth: 'auto',      
              },
              cantidad: {
                  cellWidth: 20
              }
          },
          margin: {
            top: 96
          }
        });
         // numero de paginas totales
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.setProperties({
          title: 'Reporte de Cantidades',
        });
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
       // doc.save("Eventos"+ new  Date().getTime()+".pdf");
     } else {
       this.paginacion.total = 0
     }
      }).catch(error=>{
        this.alertService.danger(
          this.translate.instant('Ocurrio un error '+error)
        );
        console.log("error ---------------->",error)
      });
  }

  pdfResumenVentas(){
    var columns = [
      {header:"Mes", dataKey:"mes"},
      {header:"Monto Dominio", dataKey:"nic"},
      {header:"Monto Certificado", dataKey:"certificado"},
      {header:"Monto Total", dataKey:"total"}
    ];
    var doc = new jsPDF('l', 'pt','letter');
    var totalPagesExp = "{total_pages_count_string}";
    var lista = [];
    var fechaactual =this.datePipe.transform(this.today, 'dd/MM/yyyy hh:mm a');

    var user = localStorage.getItem('usuario');
    var fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
    var fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`;

    this.ventasService.getVentasPorPeriodo( fechaDesde, fechaHasta).then(data =>{
        lista = data.datos;
        if (data.datos.length > 0) { 
 
        fechaDesde =this.datePipe.transform(fechaDesde, 'dd/MM/yyyy'); 
        fechaHasta =this.datePipe.transform(fechaHasta, 'dd/MM/yyyy'); 


        doc.autoTable(columns,lista,{
          didParseCell: function(data) {
               if (data.column.dataKey === 'sucursal') {
                 if (data.cell.raw != 'Sucursal') {
                   data.cell.text= data.cell.raw.nombre
                 }
               }
           },
          theme: 'grid',
          didDrawPage: function (data) {
              doc.setFontSize(20);
              doc.setTextColor(40);
              doc.setFontStyle('normal');
              doc.setFillColor(90, 50, 52);
              doc.setFontSize(20);
              doc.setFontStyle('bold');
              doc.text("Resumen de Ventas por periodo", data.settings.margin.left + 220, 42);
              doc.setFontStyle('normal');
              doc.setFontSize(12);
              doc.setFontStyle('bold');
              doc.text("Fecha del reporte: ",data.settings.margin.left , 60);
              doc.setFontStyle('normal');
              doc.text(fechaactual,data.settings.margin.left+110 , 60);
              doc.setFontStyle('bold');
              doc.text("Usuario: ",data.settings.margin.left , 73);
              doc.setFontStyle('normal');
              doc.text(user,data.settings.margin.left+50 , 73);
              if(fechaDesde && fechaHasta){
                doc.setFontSize(12);
                doc.setFontStyle('bold');
                //doc.text("Reporte del: " +fechaDesde+" al "+fechaHasta, data.settings.margin.left , 87);
                doc.text("Reporte del: ", data.settings.margin.left , 87);
                doc.setFontStyle('normal');
                doc.text(fechaDesde, data.settings.margin.left +75, 87);
                doc.setFontStyle('bold');
                doc.text(" al ", data.settings.margin.left+ 135, 87);
                doc.setFontStyle('normal');
                doc.text(fechaHasta, data.settings.margin.left+155 , 87);
              }
              // Footer
              var str = "Página " + doc.internal.getNumberOfPages()
              // Total page number 
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              doc.setFillColor(90, 50, 52);
              doc.setFontSize(10);
              doc.setFontStyle('normal');

              var pageSize = doc.internal.pageSize;
              var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
              doc.text(str, data.settings.margin.left, pageHeight - 10);
          },
          headStyles: {
            fillColor: [90, 50, 52],
            //fillColor: [81, 108, 141],
            valign: 'middle',
          },
          styles: {overflow: 'linebreak', cellWidth:'wrap'},
           columnStyles: {
             text: {
                  cellWidth: 'wrap'
              },
              estado: {
                  cellWidth: 'auto',      
              },
              cantidad: {
                  cellWidth: 20
              }
          },
          margin: {
            top: 96
          }
        });
         // numero de paginas totales
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.setProperties({
          title: 'Reporte de Cantidades',
        });
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
       // doc.save("Eventos"+ new  Date().getTime()+".pdf");
     } else {
       this.paginacion.total = 0
     }
      }).catch(error=>{
        this.alertService.danger(
          this.translate.instant('Ocurrio un error '+error)
        );
        console.log("error ---------------->",error)
      });
  }

  pdfSalud(){
    var columns = [
      {header:"ID", dataKey:"id_log"},
      {header:"Nivel", dataKey:"nivel"},
      {header:"Tipo", dataKey:"tipo"},
      {header:"Mensaje", dataKey:"mensaje"},
      {header:"Referencia", dataKey:"referencia"},
      {header:"IP", dataKey:"ip"},
      {header:"Fecha", dataKey:"fecha"},
    ];
    var doc = new jsPDF('l', 'pt','letter');
    var totalPagesExp = "{total_pages_count_string}";
    var lista = [];
    var fechaactual =this.datePipe.transform(this.today, 'dd/MM/yyyy hh:mm a');

    var user = localStorage.getItem('usuario');
    var fechaDesde = `${this.desde.year}-${this.desde.month}-${this.desde.day}`;
    var fechaHasta = `${this.hasta.year}-${this.hasta.month}-${this.hasta.day} 23:59:59`;

    this.eventosService.getEventosSaludReporte( fechaDesde, fechaHasta).then(data =>{
        lista = data.datos;
        if (data.datos.length > 0) { 
        for (var i = lista.length - 1; i >= 0; i--) {
          lista[i].fecha= this.datePipe.transform(lista[i].fecha, 'dd/MM/yyyy hh:mm a');
        }  
        fechaDesde =this.datePipe.transform(fechaDesde, 'dd/MM/yyyy'); 
        fechaHasta =this.datePipe.transform(fechaHasta, 'dd/MM/yyyy'); 


        doc.autoTable(columns,lista,{
          didParseCell: function(data) {
               if (data.column.dataKey === 'sucursal') {
                 if (data.cell.raw != 'Sucursal') {
                   data.cell.text= data.cell.raw.nombre
                 }
               }
           },
          theme: 'grid',
          didDrawPage: function (data) {
              doc.setFontSize(20);
              doc.setTextColor(40);
              doc.setFontStyle('normal');
              doc.setFillColor(90, 50, 52);
              doc.setFontSize(20);
              doc.setFontStyle('bold');
              doc.text("Estado de Salud", data.settings.margin.left + 220, 42);
              doc.setFontStyle('normal');
              doc.setFontSize(12);
              doc.setFontStyle('bold');
              doc.text("Fecha del reporte: ",data.settings.margin.left , 60);
              doc.setFontStyle('normal');
              doc.text(fechaactual,data.settings.margin.left+110 , 60);
              doc.setFontStyle('bold');
              doc.text("Usuario: ",data.settings.margin.left , 73);
              doc.setFontStyle('normal');
              doc.text(user,data.settings.margin.left+50 , 73);
              if(fechaDesde && fechaHasta){
                doc.setFontSize(12);
                doc.setFontStyle('bold');
                //doc.text("Reporte del: " +fechaDesde+" al "+fechaHasta, data.settings.margin.left , 87);
                doc.text("Reporte del: ", data.settings.margin.left , 87);
                doc.setFontStyle('normal');
                doc.text(fechaDesde, data.settings.margin.left +75, 87);
                doc.setFontStyle('bold');
                doc.text(" al ", data.settings.margin.left+ 135, 87);
                doc.setFontStyle('normal');
                doc.text(fechaHasta, data.settings.margin.left+155 , 87);
              }
              // Footer
              var str = "Página " + doc.internal.getNumberOfPages()
              // Total page number 
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              doc.setFillColor(90, 50, 52);
              doc.setFontSize(10);
              doc.setFontStyle('normal');

              var pageSize = doc.internal.pageSize;
              var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
              doc.text(str, data.settings.margin.left, pageHeight - 10);
          },
          headStyles: {
            fillColor: [90, 50, 52],
            //fillColor: [81, 108, 141],
            valign: 'middle',
          },
          styles: {overflow: 'linebreak', cellWidth:'wrap'},
           columnStyles: {
             text: {
                  cellWidth: 'wrap'
              },
              mensaje: {
                  cellWidth: 'auto',      
              },
              cantidad: {
                  cellWidth: 20
              }
          },
          margin: {
            top: 96
          }
        });
         // numero de paginas totales
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.setProperties({
          title: 'Reporte de Cantidades',
        });
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
       // doc.save("Eventos"+ new  Date().getTime()+".pdf");
     } else {
       this.paginacion.total = 0
     }
      }).catch(error=>{
        this.alertService.danger(
          this.translate.instant('Ocurrio un error '+error)
        );
        console.log("error ---------------->",error)
      });
  }

  limpiar(){
    this.boolBusqueda = false;
    this.boolBusquedaV = false;
    this.boolBusquedaS = false;
    this.paginacion.total = 1
  }

  verificaClassC(){
    if(this.boolBusqueda || this.boolBusquedaS || this.boolBusquedaV)
      return false;
    else
      return true;
  }

}