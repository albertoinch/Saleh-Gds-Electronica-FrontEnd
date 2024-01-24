import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../../../servicios/eventos.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-eventos-significativos',
  templateUrl: './eventos-significativos.component.html',
  styleUrls: ['./eventos-significativos.component.scss']
})
export class EventosSignificativosComponent implements OnInit {

  constructor(private eventosService: EventosService,
  	private alertService: AlertService,
  	private translate: TranslateService,
    private modalService: NgbModal) { }

  public eventos: any;
  limit: any;
  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};

  //variables de busqueda
  public buscarEstado: any;
  public buscarTipo: any;


  //variable para filtros
  estado: boolean = false;
  tipo: boolean = false;
  groupOptionsEstado: Array<any>;
  groupOptionsTipo: Array<any>;

  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  public idEvento: any;//->para modal

  //variables de fecha
  today = new Date();
  model:any;
  //model = { day: this.today.getUTCDay(), month: this.today.getUTCMonth(), year: this.today.getUTCFullYear()};
  //model = { day: this.today.getDay(), month: this.today.getMonth()+1, year: this.today.getFullYear()};

  defaultTime:any;
  //defaultTime = { hour: this.today.getHours(), minute: this.today.getMinutes() };

  ngOnInit() {
    this.actualizarDatos();
    this.groupOptionsEstado = [
      { value: 'ACTIVO', label: 'ACTIVO' },
      { value: 'CERRADO', label: 'CERRADO' },
      { value: 'PENDIENTE', label: 'CERRANDO' },
      //{ value: 'FINALIZADO', label: 'FINALIZADO' },
      //{ value: 'ENVIADO', label: 'ENVIADO' }
    ];
    this.groupOptionsTipo = [
      { value: 1, label: 'EVENTO POR RANGO' },
      { value: 2, label: 'INFORMATIVO' }
    ];
  }

  actualizarDatos() {
    this.eventos = [];
    this.limit = 10;
    this.buscarEstado = "";
    this.buscarTipo = "";
      this.paginar(1, this.limit, this.buscarEstado, this.buscarTipo/*,this.buscarCliente, this.buscarEstado, this.buscarNroF, this.fechaInicio, this.fechaFin*/);
  }

  paginar(page: number, limit, buscarE, buscarT/*, buscarC, buscarE, buscarF, desde, hasta*/) { 
    if (page < 1 /*|| page > this.paginacion.totalPaginas */|| !page) {
        return;
    }

    (!buscarE) ? buscarE="":"";
    (!buscarT) ? buscarT="":"";
    /*if (desde>hasta) {
      this.alertService.danger( this.translate.instant('Error al introducir fechas'));
      return;
    }*/
    this.eventos = [];
    this.eventosService.getEventos(page, limit, buscarE, buscarT/*, buscarC, buscarF, desde, hasta*/).then(data => {
      if (data.finalizado) {
        console.log(data.datos);
        this.eventos = data.datos;
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
    this.buscarTipo = "";
    this.buscarEstado = "";

    switch (caso) {
      //estado
      case 1:
        this.tipo = false;
        this.estado = true;
        break;
      //tipo
      case 2:
        this.estado = false;
        this.tipo = true;
        break;
      default:
    }
  }

  //cerrar filtro de busqueda
  close() {
    this.tipo = false;
    this.estado = false;

    this.buscarEstado = "";
    this.buscarTipo ="";
    this.paginar(1,this.limit, this.buscarEstado, this.buscarTipo);
  }

  abrirModal(plantilla, aData, seccion, dato1, dato2) {
    this.modalSeccion = seccion;
    this.modalData = aData;
    this.idEvento = null;
    switch (seccion) {
      case 'enviarIni':
        this.modalTitulo = this.translate.instant('modal.tituloEnvioEvento');
        this.idEvento = aData.id_evento_significativo;
        break;
      case 'enviarFin':
        this.modalTitulo = this.translate.instant('modal.tituloEnvioFin');
        this.idEvento = aData.id_evento;
        break;
      default:
        break;
    }

    this.modalRef = this.modalService.open(plantilla, {
      //size: 'xl',
      //backdrop: 'static',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.idEvento = null;
    this.modalData = [];
    this.modalRef.close(this.eventosService);
  }

  enviarEventoInicio(item) {
    this.eventosService.enviarInicio(item.fid_punto_venta).then(evento => {
      console.log(evento)
      if (evento.finalizado) {
        this.alertService.success(
          this.translate.instant('mensaje.evento.envioEvento')
        );
        this.actualizarDatos();
      }else{
        console.log(evento.error.mensaje)
        this.alertService.danger(
          this.translate.instant(evento.error.mensaje)
      );
      }
    }).catch(e =>{
      this.alertService.danger(
        this.translate.instant(e)
      );
    });
  }

  enviarEventoFin(idEvento) {
    if (!this.model) {
      this.alertService.danger(
        this.translate.instant('error.eventos.requeridoF')
      );
    } else {
    if (this.model.month <= 9 && this.model.month >= 0) {
      this.model.month = '0'+this.model.month 
    }
    if (this.model.day <= 9 && this.model.day >= 0) {
      this.model.day = '0'+this.model.day 
    }
    if (this.defaultTime.hour <= 9 && this.defaultTime.hour >= 0) {
      this.defaultTime.hour = '0'+this.defaultTime.hour.toString() 
    }
    if (this.defaultTime.minute <= 9 && this.defaultTime.minute >= 0) {
      this.defaultTime.minute = '0'+this.defaultTime.minute.toString() 
    }
    var datos = {
      fecha: this.model.year+'-'+this.model.month+'-'+this.model.day+'T'+this.defaultTime.hour+':'+this.defaultTime.minute+':00.000'
    }
    this.eventosService.enviarFin(this.idEvento, datos).then(evento => {
      console.log(evento)
      if (evento.finalizado) {
        this.alertService.success(
          this.translate.instant('mensaje.evento.envioFin')
        );
        this.actualizarDatos();
      }else{
        this.alertService.danger(
          this.translate.instant(evento.error.mensaje)
        );
      }
    }).catch( e =>{
      this.alertService.danger(
        this.translate.instant(e)
      );
    });
  }
  }
  /* getDescargarPdf(){
    const nombrePdf = `eventos_rep.pdf`;
    this.eventosService.getDescargarPdf('eventos_rep').subscribe(
      pdfVenta => {
        saveAs(pdfVenta, nombrePdf);
      },
      err => {
        if (err['error']) {
          this.alertService.info(err['error']);
        }
      }
    );
  } */
}
