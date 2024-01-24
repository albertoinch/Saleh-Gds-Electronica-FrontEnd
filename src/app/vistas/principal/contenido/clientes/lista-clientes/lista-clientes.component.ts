import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../../../servicios/clientes.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Para control de roles
import { UsuarioService } from '../../../../../servicios/usuario.service';
import { Rol } from '../../../../../modelos/rol';
@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.scss']
})

export class ListaClientesComponent implements OnInit {

  constructor(private clientesService: ClientesService,
  	private alertService: AlertService,
  	private translate: TranslateService,
    private modalService: NgbModal,private usuarioService: UsuarioService,) { }

  clientes: any;
  limit: any;
  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};

  //variables de busqueda
  buscarEstado: any;
  buscarCliente: any;
  buscarNroDoc: any;

  //variable para filtros
  estado: boolean = false;
  nroDoc: boolean = false;
  cliente: boolean = false;
  groupOptionsEstado: Array<any>;
  groupOptionsTipo: Array<any>;

  //variables de modal
  modalRef: NgbModalRef;
  modalData: any;
  modalSeccion: string;
  modalTitulo: any;
  idCliente: any;//->para modal
  groupOptionsSelect: Array<any>;
  ngOnInit() {
    this.groupOptionsSelect = [
      { value: 'ACTIVO', label: 'ACTIVO' },
      { value: 'INACTIVO', label: 'INACTIVO' }
    ];
  	this.actualizarDatos();
  }

  actualizarDatos() {
    this.clientes = [];
    this.limit = 10;
    this.buscarEstado="";
    this.buscarCliente="";
    this.buscarNroDoc="";
    this.nroDoc = false;
    this.estado = false;
    this.cliente = false;
    this.paginar(1, this.limit, this.buscarEstado, this.buscarCliente, this.buscarNroDoc);
  }

  paginar(page: number, limit, buscarE, buscarC, buscarTD) { 
    if (page < 1 || !page) {
        return;
    }
    this.clientes = [];
    this.clientesService.getClientes(page, limit, buscarE, buscarC, buscarTD).then(data => {
      if (data.finalizado) {
        this.clientes = data.datos;
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
    this.buscarEstado=""
    this.buscarCliente=""
    this.buscarNroDoc=""

    switch (caso) {
      //estado
      case 1:
        this.nroDoc = false;
        this.estado = true;
        this.cliente = false;
        break;
      //nro_doc
      case 2:
        this.estado = false;
        this.nroDoc = true;
        this.cliente = false;
        break;
	  //cliente
	  case 3:
	    this.estado = false;
	    this.nroDoc = false;
	    this.cliente = true;
	    break;
      default:
      	break;
    }
  }

  //cerrar filtro de busqueda
  close() {
    this.nroDoc = false;
    this.estado = false;
    this.cliente = false;

    this.buscarEstado="";
    this.buscarCliente="";
    this.buscarNroDoc="";
    this.paginar(1,this.limit, this.buscarEstado, this.buscarCliente, this.buscarNroDoc);
  }

  buscar() {
    if (this.buscarCliente != "" || this.buscarNroDoc != "" || this.buscarEstado != "") {
      this.paginar(1,this.limit, this.buscarEstado, this.buscarCliente, this.buscarNroDoc);
    }
  }

  abrirModal(plantilla, aData, seccion, dato1, dato2) {
    this.modalSeccion = seccion;
    this.modalData = aData;
    this.idCliente = null;
    switch (seccion) {
      case 'editarCli':
        this.modalTitulo = this.translate.instant('modal.tituloEditarCli');
        this.idCliente = aData.id_cliente;

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
    this.idCliente = null;
    this.modalData = [];
    this.modalRef.close(this.clientesService);
  }

  getRol() {
    return this.usuarioService.getRol();
  }

  permiteCrear(){
    var crear = false;
    const currentRol = this.getRol();
    if (Rol.AdminFactura === currentRol || Rol.Admin === currentRol) {
      crear= true
    } else {
      crear = false;
    }
    return crear
  }

}
