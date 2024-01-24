import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../../../../servicios/sucursal.service';
import { CatalogoService } from '../../../../../servicios/catalogo.service';
import { PuntoVenta } from '../../../../../modelos/puntoVenta';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AlertService } from 'ngx-alerts';
import { Router, ActivatedRoute } from '@angular/router';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crear-punto-venta',
  templateUrl: './crear-punto-venta.component.html',
  styleUrls: ['./crear-punto-venta.component.scss']
})
export class CrearPuntoVentaComponent implements OnInit {

  constructor(private sucursalService: SucursalService,
          private catalogoService: CatalogoService,
  				private modalService: NgbModal,
  				private translate: TranslateService,
  				private alertService: AlertService,
          private router: Router,
          private activatedRoute: ActivatedRoute) { }

  public puntoVenta: PuntoVenta = {
    codigo: null,
    descripcion: null,
    nombre: null,
    tipo: null,
    fidSucursal: null
  };

  groupTipos: Array<any>;
  groupTiposP: Array<any>;
  listaSucursales: Array <any>;

  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  public idSucursal: any;

  validacionNombre:any;
  validacionTipo:any;
  validacionDesc:any;
  validacionSuc:any;

  ngOnInit() {

  	this.groupTipos = [
      { value: 'SUCURSAL', label: 'SUCURSAL' },
      { value: 'PUNTO DE VENTA', label: 'PUNTO DE VENTA' },
    ];
    this.catalogoService.getTipoPuntoVenta().then(tipo => {
      this.groupTiposP = tipo.datos
    });
    this.sucursalService.getSucursales().then(suc=>{
      this.listaSucursales = suc.datos
    });
    this.activatedRoute.params.subscribe(params => {
      this.idSucursal = params['id'];
      this.puntoVenta.fidSucursal = this.idSucursal;
    });
    console.log(this.idSucursal)
  }

  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('modal.tituloCrearPunto');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  crearRegistro(){
  	if (!this.puntoVenta.nombre  || !this.puntoVenta.descripcion  || !this.puntoVenta.tipo  /* || !this.puntoVenta.fidSucursal */) {
      this.alertService.danger(
          this.translate.instant('Todos los campos son requeridos')
      );
      this.validaciones();
  	} else {
      this.puntoVenta.fidSucursal = this.idSucursal;
  		this.sucursalService.postPuntoVenta(this.puntoVenta).then(data=>{
  			if (data.finalizado) {
	  			this.alertService.success(
			        this.translate.instant('Creado con éxito.')
			    );
			    this.router.navigate([`/puntos-venta/${this.puntoVenta.fidSucursal}`]);
  			} else {
  				this.alertService.danger(
	                this.translate.instant(data.error.mensaje)
	            );
  			}
  		});
  	}
  }

  cerrarModal() {
    this.modalRef.close(this.sucursalService);
  }

  actualizarPagina() {
    this.sucursalService.actualizarPagina();
  }

  validaciones(){
    (this.puntoVenta.nombre) ? this.validacionNombre = false: this.validacionNombre = true;
    (this.puntoVenta.descripcion) ? this.validacionDesc = false: this.validacionDesc = true;
    (this.puntoVenta.tipo) ? this.validacionTipo = false: this.validacionTipo = true;
    (this.puntoVenta.fidSucursal) ? this.validacionSuc = false: this.validacionSuc = true;
  }

  validacionesNombre(){
    (this.puntoVenta.nombre) ? this.validacionNombre = false: this.validacionNombre = true;
  }

  validacionesDesc(){
  (this.puntoVenta.descripcion) ? this.validacionDesc = false: this.validacionDesc = true;
  }

  validacionesTipo(){
  (this.puntoVenta.tipo) ? this.validacionTipo = false: this.validacionTipo = true;
  }

  validacionesSuc(){
    (this.puntoVenta.fidSucursal) ? this.validacionSuc = false: this.validacionSuc = true;
  }
}
