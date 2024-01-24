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
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.scss']
})
export class CrearClienteComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
  	private clientesService: ClientesService,
  	private ventasService: VentasService,
  	private alertService: AlertService,
  	private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    private catalogoService: CatalogoService) { }
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
  
    ngOnInit() {
       this.catalogoService.getTiposDocumentoIdentidad().then(data => {
          this.groupTiposDoc = data.datos
        });
      
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
    crearRegistro(){
      if (!this.cliente.nombreRazonSocial || !this.cliente.numeroDocumento || ! this.cliente.codigoTipoDocumentoIdentidad) {
        // if (!this.verificarEmail()) {
        //   this.alertService.danger(
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
        if (this.verificarEmail()) {
            this.alertService.danger(
                this.translate.instant('error.clientes.correo')
            );
        } 
        if (this.cliente.codigoTipoDocumentoIdentidad != "2") {
          this.cliente.pais = "BOLIVIA (ESTADO PLURINACIONAL DE)";
        }
        if (!this.cliente.complemento) {
          this.cliente.complemento = "";
        }
        if (!this.cliente.fechaNacimiento) {
          this.cliente.fechaNacimiento = "";
        }
        this.cliente.nombreRazonSocial = this.cliente.nombreRazonSocial.toUpperCase();
        console.log(this.cliente);
        this.clientesService.postCliente(this.cliente).then( data=>{
          if (data.finalizado) {
            this.alertService.success(
                    this.translate.instant('mensaje.cliente.clienteCreado')
                );
                this.router.navigate(['/ventas/clientes']);
          } else {
            this.alertService.danger(
                    this.translate.instant(data.error.mensaje)
                );
          }
        });
      }
  
    }
  
    abrirModal(plantilla) {
      this.modalTitulo = this.translate.instant('modal.tituloCrearCli');
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

    actualizarPagina() {
      this.clientesService.actualizarPagina();
    }
}
