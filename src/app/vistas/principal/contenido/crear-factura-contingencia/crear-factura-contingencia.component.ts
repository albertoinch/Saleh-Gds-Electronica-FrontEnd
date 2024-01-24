import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/servicios/ventas.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacturaContingencia } from '../../../../modelos/contingencia';
import { Detalle } from '../../../../modelos/detalle';
import { FacturacionService } from '../../../../servicios/facturacion.service';
import { ItemService } from '../../../../servicios/item.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { ContingenciaService } from 'src/app/servicios/contingencia.service';
import { from } from 'rxjs';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-crear-factura-contingencia',
  templateUrl: './crear-factura-contingencia.component.html',
  styleUrls: ['./crear-factura-contingencia.component.scss']
})
export class CrearFacturaContingenciaComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private alertService: AlertService,
    private ventasService: VentasService,
    private facturacionService: FacturacionService,
    private itemService: ItemService,
    private clientesService: ClientesService,
    private contingenciaService: ContingenciaService,
    private catalogoService: CatalogoService, private modalService: NgbModal) { }
  public fechaPicker: any;
  public factura: FacturaContingencia = {
    codigoSucursal: localStorage.getItem('sucursal'),
    codigoPuntoVenta: localStorage.getItem('puntoVenta'),
    codigoTipoDocumentoIdentidad: '0',
    numeroDocumento: null,
    complemento: '',
    nombreRazonSocial: null,
    caed: null,
    fechaEmision: null,
    tipoCambio: null,
    codigoMetodoPago: null,
    descuentoAdicional: undefined,
    montoGiftCard: undefined,
    numeroTarjeta: undefined,
    numeroTarjeta1: undefined,
    numeroTarjeta2: undefined,
    tipoEmision: 2,
    numeroFactura: null,
    codigoExcepcionDocumento: null,
    pais: null,
    cafc: null,
    detalle: [{}]
  };
  //public detalle: Detalle = { idItem: null, cantidad: null };
  public detalle: Detalle = { codigoProducto: null, descripcion: '', cantidad: '1', unidadMedida: '58', precioUnitario: null };
  groupOptionsSelect: Array<any>;
  public items:any;
  groupTiposDoc: Array<any>;
  groupMetodosPago: Array<any>;
  //validaciones para estilos
  validacionTD:boolean;
  validacionND:boolean;
  validacionRS:boolean;
  validacionTE:boolean;
  validacionCD:boolean;
  validacionNF:boolean;
  
  paises:any;
  disabled:boolean=true;

  fecha:any;
  hora:any;
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
    this.groupOptionsSelect = [
      { value: 1, label: 'EN LÍNEA' },
      { value: 2, label: 'FUERA DE LÍNEA' }
    ];
    this.itemService.getItems().then(data =>{
      this.items = data.datos;
    });
    this.catalogoService.getTiposDocumentoIdentidad().then(data => {
      this.groupTiposDoc = data.datos;
    });
    this.catalogoService.getMetodosPago().then(data =>{
      this.groupMetodosPago = data.datos;
    });
    this.catalogoService.getPaises().then(data => {
      this.paises = data.datos;
    });
  }

  addItem(aData) {
    aData.push({});
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
    if (!this.factura.cafc) 
      this.validacionCD = true;
    else
      this.validacionCD = false;
    if (!this.factura.numeroFactura) 
      this.validacionNF = true;
    else
      this.validacionNF = false;
  }

  unidad(item) {
    item.imei = this.items.find(i => i.codigo == item.codigoProducto).imei;
    item.serie = this.items.find(i => i.codigo == item.codigoProducto).serie;
    item.unidadMedida = this.items.find(i => i.codigo == item.codigoProducto).codigo_unidad;
  }

  crearRegistro() {
  	this.factura.tipoCambio = '1';
  	// this.factura.tipoEmision = 2;
    //this.factura.codigoMetodoPago = 6;//--> efectivo
    this.factura.tipoEmision = 2; //factura contingencia

    this.disabled = true;
    
    if (!this.factura.codigoTipoDocumentoIdentidad || !this.factura.numeroDocumento || !this.factura.nombreRazonSocial || !this.factura.tipoEmision || !this.fecha || !this.hora || !this.factura.numeroFactura /*|| !this.factura.caed*/) {
      this.validaciones();
      this.alertService.danger(
        this.translate.instant('error.ventas.requerido')
      );
      this.disabled = false;
    } else {
      if (this.factura.codigoTipoDocumentoIdentidad == '2' && !this.factura.pais) {
        this.alertService.danger(
          this.translate.instant('Debe llenar el campo Pais')
        );
      } else {
        if (!this.ventasService.validarProductos(this.factura.detalle)) {
          this.alertService.danger(
            this.translate.instant('error.ventas.productos')
          );
          this.disabled = false;
        } else {//form-control-sm
            if (this.factura.complemento == null) {
              this.factura.complemento ="";
            }
            if (this.factura.codigoTipoDocumentoIdentidad != '2') {
              this.factura.pais = "BOLIVIA (ESTADO PLURINACIONAL DE)";
            }
            const nFechaEmision = new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day, this.hora.hour, this.hora.minute, this.hora.second);
            console.log('***FECHA: ');
            console.log(nFechaEmision);
            this.factura.fechaEmision = nFechaEmision;
            var month, day, minute;
            (this.fecha.month <= 9)? month = '0'+ this.fecha.month: month = this.fecha.month;
            (this.fecha.day <= 9)? day = '0'+ this.fecha.day: day = this.fecha.day;
            (this.hora.minnute <= 9) ? minute = '0' + this.hora.minute : minute = this.hora.minnute;
            //this.factura.fechaEmision = `${this.fecha.year}-${month}-${day}T${this.hora.hour}:${this.hora.minute}:${this.hora.second}.000`
            this.contingenciaService.postContingenciaItems(this.factura).then(dataPost => {
              if (dataPost.finalizado) {
                this.alertService.success(
                  this.translate.instant('mensaje.ventas.facturaCreada')
                );
                this.router.navigate(['/ventas/contingencias']);
              } else {
                if (dataPost.error.mensaje) {
                  this.alertService.danger(dataPost.error.mensaje);
                }
              }
              this.disabled = false;
            }).catch(e=>{
              this.disabled = false;
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

  buscarCliente(){
    if(!this.factura.numeroDocumento){
      return ;
    } else {
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
            if (data.datos) {
              this.factura.nombreRazonSocial = data.datos.razon_social;
              this.validacionesRS();
            } else {
              this.factura.nombreRazonSocial = '';
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
    console.log(this.factura.numeroTarjeta);
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

  validacionesTE(){
    if (!this.factura.tipoEmision) 
      this.validacionTE = true;
    else
      this.validacionTE = false;
  }

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

  validacionesCD(){
    if (!this.factura.cafc) 
     this.validacionCD = true;
   else
     this.validacionCD = false;
 }

 validacionesNF(){
  if (!this.factura.numeroFactura) {
    this.validacionNF = true;
  }
  else
    this.validacionNF = false;
  }
  abrirModal(plantilla) {

    this.modalTitulo = this.translate.instant('Crear Factura de Contingencia');

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.modalRef.close(this.ventasService);
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
