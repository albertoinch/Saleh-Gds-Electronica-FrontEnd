import { Component, OnInit } from '@angular/core';
import { ContribuyenteService } from '../../../../../servicios/contribuyente.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Contribuyente } from '../../../../../modelos/contribuyente';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-listar-contribuyentes',
  templateUrl: './listar-contribuyentes.component.html',
  styleUrls: ['./listar-contribuyentes.component.scss']
})
export class ListarContribuyentesComponent implements OnInit {

  constructor(private contribuyenteService: ContribuyenteService,
    private alertService: AlertService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private router: Router) { }

  public contribuyentes: any;
  limit: any;
  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};
  buscarNombre: any;
  nombre:any;
  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  public estado:any;
  public est:any;
  public checkedi:any;
  public listaAmbientes:any
  public listaModalidades:any

  ngOnInit() {
    this.listaModalidades = [
      {
        "codigo": "1",
        "descripcion": "Electrónica en línea"
      }, {
        "codigo": "2",
        "descripcion": "Computarizada en línea"
      }
    ];
    this.listaAmbientes = [
      {
        "codigo": "1",
        "descripcion": "Producción"
      }, {
        "codigo": "2",
        "descripcion": "Pruebas"
      }
    ];
    this.actualizarDatos();
  }

  actualizarDatos() {
    this.contribuyentes = [];
    this.limit = 10;
    this.buscarNombre = "";
    this.nombre = false;
    
    this.paginar(1, this.limit, this.buscarNombre);
  }

  paginar(page: number, limit, buscarNombre) { 
    if (page < 1 || !page) {
        return;
    }
    this.contribuyentes = [];
    this.contribuyenteService.getContribuyentes(page, limit, buscarNombre).then(data => {
      if (data.finalizado) {
        this.contribuyentes = data.datos;
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
    this.buscarNombre="";

    switch (caso) {
      //estado
      case 1:
        this.nombre = false;
        break;
      //nombre
      case 2:
        this.nombre = true;
        break;
      default:
          break;
      }
  }

  buscar() {
    if (this.buscarNombre != "") {
      this.paginar(1,this. limit, this.buscarNombre);
    }
  }
  close() {

    this.nombre = false;

    this.buscarNombre = "";

    this.paginar(1,this. limit, this.buscarNombre);
  }

  abrirModal(plantilla, aData) {
    this.modalTitulo = this.translate.instant('modal.tituloContribuyente');
    this.checkedi = false
    this.modalData = aData;

    this.est = this.modalData.estado;
    if (this.est === 'ACTIVO') {
      this.checkedi = true;
    } if (this.est === 'INACTIVO') {
      this.checkedi = false;
    }

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.modalRef.close(this.contribuyenteService);
  }

  toggleVisibility(e) {
    this.checkedi = e.target.checked;
  }

  crearRegistro() {
    if (this.modalData.id_contribuyente) {
      this.contribuyenteService.putContribuyente(this.modalData.id_contribuyente, this.modalData);
    } else {
      this.contribuyenteService.postContribuyente(this.modalData);
    }
  }
}
