import { Component, OnInit } from '@angular/core';
import { CodigoEspecialService } from '../../../../../servicios/codigo-especial.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Para control de roles
import { UsuarioService } from '../../../../../servicios/usuario.service';
import { Rol } from '../../../../../modelos/rol';
@Component({
  selector: 'app-codigos-especiales',
  templateUrl: './codigos-especiales.component.html',
  styleUrls: ['./codigos-especiales.component.scss']
})
export class CodigosEspecialesComponent implements OnInit {

  constructor(private codigoEspecialService: CodigoEspecialService,
    private alertService: AlertService,
    private translate: TranslateService,
    private modalService: NgbModal,private usuarioService: UsuarioService,) { }
  public codigosEspeciales:any;
  public buscarTipo: any;
  public buscarFechaFin: any;
  public buscarEstado: any;
  public limit: any;
  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};
  public tipo = false;
  public fechaFin = false;
  public estado = false;
  model:any


  ngOnInit() {
    this.codigosEspeciales = [];
    this.actualizarDatos();
  }

  actualizarDatos() {
    this.codigosEspeciales = [];
    this.buscarTipo = "";
    this.buscarFechaFin = "";
    this.buscarEstado = "";
    this.limit = 10;

    this.close();
    this.paginar(1,this.buscarTipo, this.buscarEstado, this.buscarFechaFin, this.limit);
  }

  paginar(page: number, buscarTipo, buscarEstado, buscarFechaFin, limit) { 
    if (page < 1 || !page) {
        return;
    }

    this.codigosEspeciales = [];
    this.codigoEspecialService.getCodigos(page, buscarTipo, buscarEstado, buscarFechaFin, limit).then(data => {
      if (data.finalizado) {
        this.codigosEspeciales = data.datos;
        this.paginacion.total = data.paginacion.totalRegistros;
        this.paginacion.cantidad = data.paginacion.cantidad;
        this.paginacion.totalPaginas = data.paginacion.paginas;
        this.paginacion.paginaActual = parseInt(data.paginacion.paginaActual);
      } else {
        this.alertService.danger( this.translate.instant(data.error.mensaje));
      }
    }).catch(error=>{
      this.alertService.danger( this.translate.instant(error));
    });
  }

   //cerrar filtro de busqueda
   close() {
    this.buscarTipo = "";
    this.buscarFechaFin = "";
    this.buscarEstado = "";
    this.model = "";

    this.estado = false;
    this.tipo = false;
    this.fechaFin = false;

    this.paginar(1,this.buscarTipo, this.buscarEstado, this.buscarFechaFin, this.limit);
  }

  getRol() {
    return this.usuarioService.getRol();
  }

  permiteCrear(){
    const currentRol= this.getRol();
    if (Rol.Revisor === currentRol || Rol.Admin === currentRol) {
        return true;
    } else
      return false;
  }

  casoBusqueda(caso) {
    this.buscarTipo = "";
    this.buscarFechaFin = "";
    this.buscarEstado = "";

    switch (caso) {
      //tipo de codigo
      case 1:
        this.tipo = true;
        this.fechaFin = false;
        this.estado = false;
        break;
      //codigo 
      case 2:
        this.tipo = false;
        this.estado = true;
        this.fechaFin = false;
        break;
      //fecha fin
      case 3:
        this.tipo = false;
        this.estado = false;
        this.fechaFin = true;
        break;
      default:
        break;
    }
  }

  buscar() {
    if (this.model) {
      this.buscarFechaFin = `${this.model.year}-${this.model.month}-${this.model.day}`
    }
    if (this.buscarTipo != "" || this.buscarEstado != ""|| this.buscarFechaFin != "" ) {
      this.paginar(1,this.buscarTipo, this.buscarEstado, this.buscarFechaFin, this.limit);
    }
  }

}
