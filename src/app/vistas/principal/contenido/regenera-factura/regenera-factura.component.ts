import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VentasService } from '../../../../servicios/ventas.service';
import { Factura } from '../../../../modelos/factura';
import { Detalle } from '../../../../modelos/detalle';
import { ItemService } from '../../../../servicios/item.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService } from '@ngx-translate/core';
import { FacturacionService } from '../../../../servicios/facturacion.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { CatalogoService } from '../../../../servicios/catalogo.service';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-regenera-factura',
  templateUrl: './regenera-factura.component.html',
  styleUrls: ['./regenera-factura.component.scss']
})
export class RegeneraFacturaComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
  	private ventasService: VentasService,
  	private facturasService: FacturacionService,
  	private itemService: ItemService,
  	private router: Router,
    private translate: TranslateService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private clientesService: ClientesService,
    private catalogoService: CatalogoService) { }
  idVenta:any;
  public factura: Factura = {
    codigoSucursal: '0',
    codigoPuntoVenta: '0',
    codigoTipoDocumentoIdentidad: '0',
    numeroDocumento: null,
    complemento: '',
    nombreRazonSocial: null,
    codigoExcepcion: null,
    email: null,
    tipoCambio: null,
    codigoMetodoPago: 1,
    descuentoAdicional: undefined,
    montoGiftCard: undefined,
    numeroTarjeta: null,
    numeroTarjeta1: null,
    numeroTarjeta2: null,
    codigoExcepcionDocumento: null,
    tipoEmision: null,
    pais: null,
    detalle: [{}],
    deposito: null
  };
  public facturaDatos = {
    codigoTipoDocumentoIdentidad: 0,
    numeroDocumento: null,
    complemento: '',
    nombreRazonSocial: null,
    tipoCambio: null,
    codigoMetodoPago: null,
    tipoEmision: null,
    detalle: [{}],
    fechaEmision: ''
  };
  public detalle: Detalle = { idItem: null, cantidad: null };
 detalleI: Array<any>;
   // detalleI=[];
  groupOptionsSelect: Array<any>;
  groupTiposDoc: Array<any>;
  public items:any;
  //validaciones de campos
  validacionTD:boolean=null;
  validacionND:boolean=null;
  validacionRS:boolean=null;
  // validacionTE:boolean=null;
  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  marked = false;
  excepcion:any;
  ngOnInit() {
  	this.activatedRoute.params.subscribe(params => {
        this.idVenta = params['id'];
    });
	  this.groupOptionsSelect = [
      { value: 1, label: 'EN LÍNEA' },
      { value: 2, label: 'FUERA DE LÍNEA' }
    ];
    this.catalogoService.getTiposDocumentoIdentidad().then(data => {
      this.groupTiposDoc = data.datos;
    });
    this.itemService.getItems().then(data =>{
      this.items = data.datos;
    });
    this.detalleI=[]

  	this.ventasService.buscarVenta(this.idVenta).then(data=>{
      console.log("... entra a buscar venta//////////////////////")
      this.factura.codigoTipoDocumentoIdentidad = data.datos.codigoTipoDocumentoIdentidad;
      this.factura.numeroDocumento = data.datos.numeroDocumento;
      this.factura.complemento = data.datos.complemento;
      this.factura.nombreRazonSocial = data.datos.nombreRazonSocial;
      //this.excepcion = data.datos.codigo_recepcion
      //this.factura.codigoExcepcionDocumento = data.datos.codigo_recepcion
      // this.factura.tipoEmision = data.datos.tipo_emision;
      /*for (let i = 0; i < data.datos.detalle.length; i++) {
        var obj = {
          idItem: data.datos.detalle[i].item.id_item,
          cantidad: data.datos.detalle[i].cantidad
        }
        if (data.datos.detalle[i].item.id_item) {
          this.detalleI.push(obj);
        }
      }*/
      this.facturaDatos.fechaEmision = data.datos.fecha;
    })
  }

  actualizarPagina() {
    this.facturasService.actualizarPagina();
  }

  addItem(aData) {
    aData.push({});
  }

  delItem(aData) {
    aData.splice(-1, 1);
  }

  crearRegistro() {
  	this.factura.tipoCambio = '1';
  	this.factura.codigoMetodoPago = 1;//--> efectivo
   
    if (!this.factura.codigoTipoDocumentoIdentidad || !this.factura.numeroDocumento || !this.factura.nombreRazonSocial /* || !this.factura.tipoEmision */) {
      this.validaciones();
      this.alertService.danger(
        this.translate.instant('error.ventas.requerido')
      );
    } else {
      /*if (!this.ventasService.validarProductos(this.detalleI)) {
        this.alertService.danger(
          this.translate.instant('error.ventas.productos')
        );
      } else {//form-control-sm*/
          if (this.factura.complemento == null) {
            this.factura.complemento = "";
          }
          /* if (this.factura.codigoTipoDocumentoIdentidad == 2) {
            this.factura.numeroDocumento = "E-"+this.factura.numeroDocumento;
          } */
          /*if (this.factura.codigoTipoDocumentoIdentidad != '2') {
            this.factura.pais = "379";
          }*/
          //this.factura.detalle = this.detalleI;
          this.factura.nombreRazonSocial = this.factura.nombreRazonSocial.toUpperCase();
          Object.assign(this.facturaDatos, this.factura);
          this.facturasService.regenerarVentaObs(this.idVenta, this.facturaDatos).then(dataPost => {
            if (dataPost.finalizado) {
              this.alertService.success(
                this.translate.instant('mensaje.ventas.regeneraFactura')
              );
            } else {
              if (dataPost.error.mensaje) {
                this.alertService.danger(dataPost.error.mensaje);
              }
            }
            this.router.navigate(['/']);
          });
      //}
    }
  }

  validaciones(){
     if (!this.factura.codigoTipoDocumentoIdentidad) {
      this.validacionTD = true;
    }
    if (!this.factura.numeroDocumento) {
      this.validacionND = true;
    }
    if (!this.factura.nombreRazonSocial) {
      this.validacionRS = true;
    }
    /* if (!this.factura.tipoEmision) {
      this.validacionTE = true;
    } */
  }

  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('modal.tituloRegenerar');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    //this.modalData = [];
    this.modalRef.close(this.ventasService);
  }

  buscarCliente(){
    if(!this.factura.numeroDocumento){
      return ;
    }
    else {
      var comp;
      (this.factura.complemento)? comp = this.factura.complemento.toUpperCase():comp='';
      this.clientesService.buscarClienteCI(this.factura.numeroDocumento, comp, this.factura.codigoTipoDocumentoIdentidad).then(data=>{
        if (data.datos) {
          this.factura.nombreRazonSocial = data.datos.razon_social
        } else {
          //this.factura.nombreRazonSocial = ''
        }
        if (this.factura.codigoTipoDocumentoIdentidad == '5' && data.datos && data.datos.nitValidado == false) {
          this.factura.codigoExcepcion = '1';
        } else {
          delete this.factura['codigoExcepcion'];
        }
        this.validacionesRS();
      })
    }
  }

  validacionesRS(){
    if (!this.factura.nombreRazonSocial) 
     this.validacionRS = true;
   else
     this.validacionRS = false;
 }

  validarNit(){
    if (this.factura.numeroDocumento) {
      this.validacionND = false
    } else {
      this.validacionND = true
    }
  }

  toggleVisibility(e){
    this.marked= e.target.checked;
    if (this.marked) {
      this.factura.codigoExcepcionDocumento = this.excepcion;
    } else {
      this.factura.codigoExcepcionDocumento = null;
    }
  }

}
