import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../../../../servicios/sucursal.service';
import { Sucursal } from '../../../../../modelos/sucursal';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AlertService } from 'ngx-alerts';
import { Router, ActivatedRoute } from '@angular/router';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-crear-sucursal',
  templateUrl: './crear-sucursal.component.html',
  styleUrls: ['./crear-sucursal.component.scss']
})
export class CrearSucursalComponent implements OnInit {

  constructor(private sucursalService: SucursalService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private alertService: AlertService,
    private router: Router) { }

  public sucursal: Sucursal = {
    codigo: null,
    descripcion: null,
    nombre: null,
    municipio: null,
    direccion: null,
    telefono: null
  };

  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  

  ngOnInit() {
  }
  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('modal.tituloCrearSucursal');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  crearRegistro(){
  	if (!this.sucursal.nombre  || !this.sucursal.descripcion  || !this.sucursal.direccion) {
      this.alertService.danger(
          this.translate.instant('Todos los campos son requeridos')
      );
  	} else {
      console.log("............", this.sucursal)
  		this.sucursalService.postSucursal(this.sucursal).then(data=>{
  			if (data.finalizado) {
	  			this.alertService.success(
			        this.translate.instant('Creado con éxito.')
			    );
			    this.router.navigate(['/sucursales']);
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

}
