import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../../../servicios/eventos.service';
import { SucursalService } from '../../../../servicios/sucursal.service';
import { Evento } from '../../../../modelos/evento';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.scss']
})
export class CrearEventoComponent implements OnInit {

  constructor(private eventosService: EventosService,
  	private alertService: AlertService,
  	private translate: TranslateService,
  	private router: Router,
    private sucursalService: SucursalService,
    private catalogoService: CatalogoService,
    private modalService: NgbModal) { }

  public evento: Evento = {
    tipo: null,
    codigoEvento: null,
    descripcion: null,
    idPuntoVenta: null,
    fecha_inicio: null,
    cafc: null
  };
  groupOptionsTipo: Array<any>;
  listaEventos:any;
  listaPuntosVenta:any;
  fecha:any;
  hora:any;
  //para validaciones
  validacionT:boolean;
  validacionE:boolean;
  validacionFecha:boolean;
  validacionHora:boolean;
  validacionDesc:boolean;
  validacionS:boolean;
  validacionCafc:boolean;
  //PARA BOTON GUARADAR
  disabled:boolean=true;

  suc:any;
  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;

  ngOnInit() {
  	this.groupOptionsTipo = [
      { value: 1, label: 'EVENTO POR RANGO' },
      { value: 2, label: 'INFORMATIVO' }
    ];
    this.catalogoService.getMotivoEvento().then(eventos=>{
    	this.listaEventos = eventos.datos
    });
    /* this.eventosService.getEventosCatalogo().then(eventos=>{
    	this.listaEventos = eventos.datos
    }); */
    this.sucursalService.getPuntosVenta().then(data=>{
    	this.listaPuntosVenta = data.datos
    });
  }

  actualizarPagina() {
    this.eventosService.actualizarPagina();
  }

  crearRegistro() {
    this.disabled = false;
    if (!this.evento.descripcion /*|| !this.evento.tipo*/ || !this.evento.codigoEvento || !this.fecha || !this.hora) {
      this.validaciones();
      this.alertService.danger(
        this.translate.instant('error.ventas.requerido')
      );
      this.disabled = true;
    } else {
      this.verificaTipo();
      this.evento.fecha_inicio = `${this.fecha.year}-${this.fecha.month}-${this.fecha.day} ${this.hora.hour}:${this.hora.minute}:00.000`;
      this.evento.descripcion = this.evento.descripcion.toUpperCase();
      this.eventosService.postEvento(this.evento).then(dataPost => {
            if (dataPost.finalizado) {
                  this.alertService.success(
                    this.translate.instant(dataPost.mensaje)
                  );
                  this.router.navigate(['/ventas/eventos']);
            } else {
                  if (dataPost.error.mensaje) {
                    this.alertService.danger(dataPost.error.mensaje);
                  }
            }
            this.disabled = true;
        }).catch(e=>{
          this.disabled = true;
        });
    }
  }

  validaciones(){
    if (!this.evento.tipo) 
      this.validacionT = true;
    else
      this.validacionT = false;
    if (!this.evento.codigoEvento) 
      this.validacionE = true;
    else
      this.validacionE = false;
    if (!this.fecha) 
      this.validacionFecha = true;
    else
      this.validacionFecha = false;
    if (!this.hora) 
      this.validacionHora = true;
    else
      this.validacionHora = false;
    if (!this.evento.descripcion) 
      this.validacionDesc = true;
    else
      this.validacionDesc = false;
    if (!this.evento.idPuntoVenta) 
      this.validacionS = true;
    else
      this.validacionS = false;
  }

  validacionesT(){
    if (!this.evento.tipo) 
      this.validacionT = true;
    else
      this.validacionT = false;
  }

  validacionesE(){
    if (!this.evento.codigoEvento) 
      this.validacionE = true;
    else
      this.validacionE = false;
  }

  validacionesFecha(){
    if (!this.fecha) {
      this.validacionFecha = true;
    }
    else
      this.validacionFecha = false;
  }

  validacionesHora(){
    if (!this.hora) 
      this.validacionHora = true;
    else
      this.validacionHora = false;
  }

  validacionesDesc(){
    if (!this.evento.descripcion) 
      this.validacionDesc = true;
    else
      this.validacionDesc = false;
  }

  validacionesS(){
    console.log(this.evento.idPuntoVenta)
    if (!this.evento.idPuntoVenta) 
      this.validacionS = true;
    else
      this.validacionS = false;
  }

  validacionesCafc(){
    const contingencia = [4, 5, 6, 7];
    if (contingencia.indexOf(parseInt(this.evento.codigoEvento)) > -1) {
      if (!this.evento.cafc) {
        this.validacionCafc = true;
      } else {
        this.validacionCafc = false;
      }
    } else {
      this.validacionCafc = false;
    }
  }

  verificaTipo(){
    console.log(this.evento.codigoEvento)
    //const contingencia = [970, 972, 973, 974, 975, 976, 977];
    const contingencia = [1, 2, 3, 4, 5, 6, 7];
    console.log("entra a if",contingencia.indexOf(parseInt(this.evento.codigoEvento)));
    if (contingencia.indexOf(parseInt(this.evento.codigoEvento)) >= 1) {
      this.evento.tipo = 'RANGO';
      console.log("entra a if", this.evento.tipo);
    } else {
      this.evento.tipo = 'INFORMATIVO';
      console.log("entra a else",this.evento.tipo);

    }
  }

  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('modal.tituloCrearEvento');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.modalRef.close(this.eventosService);
  }

}
