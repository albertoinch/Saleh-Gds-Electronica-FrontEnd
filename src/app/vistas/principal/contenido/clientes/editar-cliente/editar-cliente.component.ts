import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../../../../servicios/clientes.service';
import { Cliente } from '../../../../../modelos/cliente';
import { VentasService } from '../../../../../servicios/ventas.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CatalogoService } from '../../../../../servicios/catalogo.service';

//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.scss']
})
export class EditarClienteComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
  	private clientesService: ClientesService,
  	private ventasService: VentasService,
  	private alertService: AlertService,
  	private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    private catalogoService: CatalogoService) { }
  idCliente:any;
  public cliente: Cliente = {
    complemento: null,
    estado: null,
    fechaNacimiento: null,
    // id_cliente: 0,
    numeroDocumento: null,
    nombreRazonSocial: null,
    codigoTipoDocumentoIdentidad: null,
    correo: '',
    pais: null
  };
  groupTiposDoc: Array<any>;
  groupOptionsSelect: Array<any>;
    //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  public idVenta: any;//->para modal

  validarEmail:boolean=false;
  paises:any;
  estado: any;

  ngOnInit() {
  	this.activatedRoute.params.subscribe(params => {
	  this.idCliente = params['id'];
    });
  	 this.clientesService.buscarCliente(this.idCliente).then(data=>{
       this.cliente = data.datos;
       this.cliente.nombreRazonSocial = data.datos.razon_social;
       this.cliente.codigoTipoDocumentoIdentidad = data.datos.tipo_documento;
       this.cliente.fechaNacimiento = data.datos.fecha_nacimiento;
       this.cliente.numeroDocumento = data.datos.numero_documento;
  	 	//this.fechaNac=this.datos.fecha_nacimiento
     }),
     this.catalogoService.getTiposDocumentoIdentidad().then(data => {
        this.groupTiposDoc = data.datos
      });
  	 /* this.ventasService.getTipoDocumentosIdentidad().then(data => {
      this.groupTiposDoc = data.datos
    }); */
  	 this.groupOptionsSelect = [
      { value: 'ACTIVO', label: 'ACTIVO' },
      { value: 'INACTIVO', label: 'INACTIVO' },
    ];
    /* this.ventasService.getPaises().then(data =>{
      this.paises = data.datos;
    }); */
    this.catalogoService.getPaises().then(data =>{
      this.paises = data.datos;
    });
  }

  verifyDate() {
    // if (this.cliente.fec_nacimiento != null && this.cliente.fec_nacimiento != "") {
    //   this.fecha2 = null;
    //   return (this.clientesService.verificarFecha(this.cliente.fec_nacimiento));
    // }

    // let fecha = this.fechaNac;
    // if (fecha != "" && fecha != null && fecha.length >= 8) {
    //   this.fecha2 = [fecha.slice(0, 2), "/", fecha.slice(2)].join('');
    //   this.fecha2 = [this.fecha2.slice(0, 5), "/", this.fecha2.slice(5)].join('');
    //   return (this.clientesService.verificarFecha(this.fecha2));
    // }
    // else {
    //   return (this.clientesService.verificarFecha(fecha));
    // }
  }
  actualizaCliente(){
  	if ( !this.cliente.nombreRazonSocial || !this.cliente.numeroDocumento|| ! this.cliente.codigoTipoDocumentoIdentidad) {
  		// if ( !this.verificarEmail()) {
  		// 	this.alertService.danger(
		  //       this.translate.instant('error.clientes.fecha')
		  //   );
  		// } else {
  			this.alertService.danger(
		        this.translate.instant('error.clientes.vacio')
		    );
  		// }
  		return;
  	} else {
  		if (this.cliente.fechaNacimiento) {
  			var now = new Date()
  			var fecha = this.cliente.fechaNacimiento.split('-');
  			if (now.getFullYear() - parseInt(fecha[0]) < 15) {
  				this.alertService.danger(
			        this.translate.instant('error.clientes.fechaE')
			    );
			    return;
  			}
      }
      
  		this.cliente.nombreRazonSocial = this.cliente.nombreRazonSocial.toUpperCase();
      console.log(this.cliente);
      // this.cliente.estado = this.estado;
	    this.clientesService.putCliente(this.idCliente, this.cliente).then( data=>{
  			if (data.finalizado) {
  				this.alertService.success(
	                this.translate.instant('mensaje.cliente.clienteEditado')
	            );
	            this.router.navigate(['/clientes']);
  			} else {
  				this.alertService.danger(
	                this.translate.instant(data.error.mensaje)
	            );
  			}
  			console.log(data)
  		});
  	}

  }

  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('modal.tituloEditarCli');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    //this.modalData = [];
    this.modalRef.close(this.clientesService);
  }

  //validaciones
    verificarEmail() {
        return this.clientesService.verificarEmail(this.cliente.correo);
    }

}
