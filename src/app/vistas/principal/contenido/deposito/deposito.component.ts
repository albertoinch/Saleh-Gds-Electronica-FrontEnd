import { Component, OnInit } from '@angular/core';
import { VentasService } from 'src/app/servicios/ventas.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Factura } from '../../../../modelos/factura';
import { Deposito } from '../../../../modelos/deposito';
import { FacturacionService } from '../../../../servicios/facturacion.service';
import { ItemService } from '../../../../servicios/item.service';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { CatalogoService } from '../../../../servicios/catalogo.service';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deposito',
  templateUrl: './deposito.component.html',
  styleUrls: ['./deposito.component.scss']
})
export class DepositoComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private alertService: AlertService,
    private ventasService: VentasService,
    private facturacionService: FacturacionService,
    private itemService: ItemService,
    private clientesService: ClientesService,
    private modalService: NgbModal,
    private catalogoService: CatalogoService) { }
  idVenta:any;
  public fechaPicker: any;
  public total =  0;
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
    codigoMetodoPago: null,
    descuentoAdicional: undefined,
    montoGiftCard: undefined,
    numeroTarjeta: null,
    numeroTarjeta1: null,
    numeroTarjeta2: null,
    codigoExcepcionDocumento: null,
    tipoEmision: null,
    pais: null,
    detalle: null,
    deposito: [{}]
  };
  public deposito: Deposito = { codigoProducto: null, descripcion: '', cantidad: '1', unidadMedida: '58', precioUnitario: null };
  groupOptionsSelect: Array<any>;
  public items:any;
  groupTiposDoc: Array<any>;
  //validacionTD:boolean=false;
  validacionTD:boolean;
  validacionND:boolean;
  validacionRS:boolean;
  validacionTE:boolean;

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
    this.activatedRoute.params.subscribe(params => {
      this.idVenta = params['id'];
    });
  	this.catalogoService.getTiposDocumentoIdentidad().then(data =>{
      this.groupTiposDoc = data.datos;
    });
    this.catalogoService.getPaises().then(data =>{
      this.paises = data.datos;
    });
    this.ventasService.buscarVenta(this.idVenta).then(data=>{
      console.log("... entra a buscar venta//////////////////////")
      this.factura.codigoTipoDocumentoIdentidad = data.datos.codigoTipoDocumentoIdentidad;
      this.factura.numeroDocumento = data.datos.numeroDocumento;
      this.factura.complemento = data.datos.complemento;
      this.factura.nombreRazonSocial = data.datos.nombreRazonSocial;
      if (data.datos.depositos.length > 0) {
        this.factura.deposito = data.datos.depositos;
      }
    });
  }

  addItem(aData) {
    aData.push({
      numero: null,
      fecha: null
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

  crearRegistro() {
    this.ventasService.postDeposito(this.idVenta, this.factura.deposito).then(dataPost => {
      if (dataPost.finalizado) {
        this.alertService.success(
          this.translate.instant('mensaje.ventas.depositoRegistrado')
        );
      } else {
        if (dataPost.error.mensaje) {
          this.alertService.danger(dataPost.error.mensaje);
        }
      }
      this.router.navigate(['/']);
    }).catch(e=>{
    });
  }

  actualizarPagina() {
    this.facturacionService.actualizarPagina();
  }

  abrirModal(plantilla) {
    this.modalTitulo = this.translate.instant('Registar Depósitos');

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
}
