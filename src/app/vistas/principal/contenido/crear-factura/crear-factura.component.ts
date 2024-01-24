import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/servicios/ventas.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Factura } from '../../../../modelos/factura';
import { Detalle } from '../../../../modelos/detalle';
import { FacturacionService } from '../../../../servicios/facturacion.service';
import { ItemService } from '../../../../servicios/item.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { CatalogoService } from '../../../../servicios/catalogo.service';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crear-factura',
  templateUrl: './crear-factura.component.html',
  styleUrls: ['./crear-factura.component.scss']
})
export class CrearFacturaComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private alertService: AlertService,
    private ventasService: VentasService,
    private facturacionService: FacturacionService,
    private itemService: ItemService,
    private clientesService: ClientesService,
    private modalService: NgbModal,
    private catalogoService: CatalogoService) { }

  public fechaPicker: any;
  public total =  0;
  public factura: Factura = {
    codigoSucursal: localStorage.getItem('sucursal'),
    codigoPuntoVenta: localStorage.getItem('puntoVenta'),
    codigoTipoDocumentoIdentidad: '0',
    numeroDocumento: null,
    complemento: '',
    nombreRazonSocial: null,
    codigoExcepcion: null,
    email: null,
    tipoCambio: null,
    codigoMetodoPago: 6,
    descuentoAdicional: undefined,
    montoGiftCard: undefined,
    numeroTarjeta: undefined,
    numeroTarjeta1: undefined,
    numeroTarjeta2: undefined,
    codigoExcepcionDocumento: null,
    tipoEmision: null,
    pais: null,
    detalle: [{}],
    deposito: null
  };
  public detalle: Detalle = { codigoProducto: null, descripcion: '', cantidad: '1', unidadMedida: '58', precioUnitario: null };
  groupOptionsSelect: Array<any>;
  public items:any;
  groupTiposDoc: Array<any>;
  groupMetodosPago: Array<any>;
  //validacionTD:boolean=false;
  validacionTD:boolean;
  validacionND:boolean;
  validacionRS:boolean;
  validacionTE:boolean;
  validacionPa:boolean;

  paises:any;
  disabled:boolean=true;
   //variables de modal
   private modalRef: NgbModalRef;
   public modalData: any;
   public modalSeccion: string;
   public modalTitulo: any;
  //ṔARA SWITCH
  marked = false;
  theCheckbox = false;

  ngOnInit() {
  	this.factura.detalle = [];
    this.factura.detalle.push(this.detalle);
    /* this.groupOptionsSelect = [
      { value: 1, label: 'EN LÍNEA' },
      { value: 2, label: 'FUERA DE LÍNEA' }
    ]; */
    this.itemService.getItems().then(data =>{
      this.items = data.datos;
    });
    /*this.ventasService.getTipoDocumentosIdentidad().then(data => {
      this.groupTiposDoc = data.datos;
    });
     this.ventasService.getPaises().then(data =>{
      this.paises = data.datos;
    }); */
    this.catalogoService.getTiposDocumentoIdentidad().then(data =>{
      this.groupTiposDoc = data.datos;
    });
    this.catalogoService.getMetodosPago().then(data =>{
      this.groupMetodosPago = data.datos;
    });
    this.catalogoService.getPaises().then(data =>{
      this.paises = data.datos;
    });
  }

  addItem(aData) {
    aData.push({
      codigoProducto: null,
      descripcion: '',
      cantidad: '1',
      unidadMedida: '58',
      precioUnitario: null
    });
  }

  delItem(aData) {
    aData.splice(-1, 1);
  }

  validaciones(){
    if (!this.factura.codigoTipoDocumentoIdentidad) 
      this.validacionTD = true;
    else
      this.validacionTD = false;
    if (!this.factura.numeroDocumento) 
      this.validacionND = true;
    else
      this.validacionND = false;
    if (!this.factura.nombreRazonSocial) 
      this.validacionRS = true;
    else
      this.validacionRS = false;
    if (!this.factura.tipoEmision) 
      this.validacionTE = true;
    else
      this.validacionTE = false;
  }

  unidad(item) {
    item.imei = this.items.find(i => i.codigo == item.codigoProducto).imei;
    item.serie = this.items.find(i => i.codigo == item.codigoProducto).serie;
    item.unidadMedida = this.items.find(i => i.codigo == item.codigoProducto).codigo_unidad;
  }

  crearRegistro() {
  	this.factura.tipoCambio = '1';
    //this.factura.codigoMetodoPago = 6;//--> efectivo
    this.factura.tipoEmision = 1; //factura normal
   
    if (!this.factura.codigoTipoDocumentoIdentidad || !this.factura.numeroDocumento || !this.factura.nombreRazonSocial) {
      this.validaciones();
      this.alertService.danger(
        this.translate.instant('error.ventas.requerido')
      );
    } else {
      this.factura.nombreRazonSocial = this.factura.nombreRazonSocial.toUpperCase();
      if (this.factura.codigoTipoDocumentoIdentidad == '2' && !this.factura.pais) {
          this.alertService.danger(
            this.translate.instant('Debe llenar el campo Pais')
          );
      } else {
        if (!this.ventasService.validarProductos(this.factura.detalle)) {
          this.alertService.danger(
            this.translate.instant('error.ventas.productos')
          );
        } else {
            if (this.factura.complemento == null) {
              this.factura.complemento ="";
            }
            if (this.factura.codigoTipoDocumentoIdentidad != '2') {
              this.factura.pais = "BOLIVIA (ESTADO PLURINACIONAL DE)";
            }
            this.ventasService.postVenta(this.factura).then(dataPost => {
              if (dataPost.finalizado) {
                this.alertService.success(
                  this.translate.instant('mensaje.ventas.facturaCreada')
                );
                this.router.navigate(['/']);
              } else {
                if (dataPost.error.mensaje) {
                  this.alertService.danger(dataPost.error.mensaje);
                }
              }
            }).catch(e=>{
            });
        }

      }
    }
  }

  actualizarPagina() {
    this.facturacionService.actualizarPagina();
  }

  validarNumero(event, numero) {
    return this.facturacionService.validarNumeros(event, numero);
  }

  sumar() {
    this.total = 0;
    for (let i = 0; i < this.factura.detalle.length; i++) {
      this.total += parseFloat(this.factura.detalle[i]['cantidad']) * (parseFloat(this.factura.detalle[i]['precioUnitario']) - parseFloat(this.factura.detalle[i]['montoDescuento'] || 0));
    }
  }

  buscarCliente(){
    if(!this.factura.numeroDocumento){
      return ;
    }
    else {
      switch (this.factura.numeroDocumento) {
        case '99001':
          this.factura.codigoTipoDocumentoIdentidad = '5';
          this.factura.nombreRazonSocial = '';
          break;
        case '99002':
          this.factura.codigoTipoDocumentoIdentidad = '5';
          this.factura.nombreRazonSocial = 'Control Tributario';
          break;
        case '99003':
          this.factura.codigoTipoDocumentoIdentidad = '5';
          this.factura.nombreRazonSocial = 'Ventas Menores del Día';
          break;
        default:
          this.clientesService.buscarClienteCI(this.factura.numeroDocumento, this.factura.complemento.toUpperCase(), this.factura.codigoTipoDocumentoIdentidad).then(data=>{
            if (data.datos && data.datos.razon_social) {
              this.factura.nombreRazonSocial = data.datos.razon_social;
              this.validacionesRS();
            } else {
              this.factura.nombreRazonSocial = '';
            }
            if (this.factura.codigoTipoDocumentoIdentidad == '5' && data.datos && data.datos.nitValidado == false) {
              this.factura.codigoExcepcion = '1';
            } else {
              delete this.factura['codigoExcepcion'];
            }
          });
      }
    }
  }

  tarjeta() {
    if (this.factura.numeroTarjeta1 && this.factura.numeroTarjeta1.length == 4 && this.factura.numeroTarjeta2 && this.factura.numeroTarjeta2.length == 4) {
      this.factura.numeroTarjeta = `${this.factura.numeroTarjeta1}00000000${this.factura.numeroTarjeta2}`;
    } else {
      this.factura.numeroTarjeta = undefined;
    }
  }

  tarjetaNull() {
    const tarjeta = [2,10,16,17,18,19,20,39,40,41,42,43,82,83,84,85,86,87,88,89,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,223,297];
    if (tarjeta.find(e => e == this.factura.codigoMetodoPago)) {
      this.factura.numeroTarjeta1 = '';
      this.factura.numeroTarjeta2 = '';
      this.factura.numeroTarjeta = `${this.factura.numeroTarjeta1}00000000${this.factura.numeroTarjeta2}`;
    } else {
      this.factura.numeroTarjeta1 = undefined;
      this.factura.numeroTarjeta2 = undefined;
      this.factura.numeroTarjeta = undefined;
    }
    const giftcard = [27,30,35,64,68,76,86,94,102,109,115,120,124,138,146,153,159,164,168,182,189,195,200,204,217,223,228,232,241,246,250,261,265,269,270,271,275,279,280,281,291,292,293];
    if (giftcard.find(e => e == this.factura.codigoMetodoPago)) {
      this.factura.montoGiftCard = 0;
    } else {
      this.factura.montoGiftCard = undefined;
    }
  }

  validacionesTD(){
    if (!this.factura.codigoTipoDocumentoIdentidad) 
      this.validacionTD = true;
    else
      this.validacionTD = false;
  }
  /* validacionesTE(){
    console.log("datos hasta ahora !!!!!!!!!!!!!!", this.factura.tipoEmision)
    if (!this.factura.tipoEmision) 
      this.validacionTE = true;
    else
      this.validacionTE = false;
  } */

  validacionesND(){
    if (!this.factura.numeroDocumento) {
      this.validacionND = true;
      this.validacionesRS();
    }
    else
      this.validacionND = false;
  }

  validacionesRS(){
     if (!this.factura.nombreRazonSocial) 
      this.validacionRS = true;
    else
      this.validacionRS = false;
  }

  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('Crear Factura');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.modalRef.close(this.ventasService);
  }

  switchClicked(event) {
      console.log(event.srcElement.checked);
  }

  toggleVisibility(e){
    this.marked= e.target.checked;
    if (this.marked) {
      this.factura.codigoTipoDocumentoIdentidad = '5';
      this.factura.numeroDocumento = '99002';
      this.factura.nombreRazonSocial = 'Control Tributario';
    } else {
      this.factura.codigoTipoDocumentoIdentidad = null;
      this.factura.numeroDocumento = null;
      this.factura.nombreRazonSocial = null;
    }
  }

}
