export class Factura {
  constructor(
    public codigoSucursal: string,
    public codigoPuntoVenta: string,
    public codigoTipoDocumentoIdentidad: string,
    public numeroDocumento: string,
    public complemento: string,
    public nombreRazonSocial: string,
    public codigoExcepcion: string,
    public email: string,
    public tipoCambio: string,
    public codigoMetodoPago: number,
    public descuentoAdicional: number,
    public montoGiftCard: number,
    public numeroTarjeta: string,
    public numeroTarjeta1: string,
    public numeroTarjeta2: string,
    public codigoExcepcionDocumento: number,
    public tipoEmision: number, 
    public pais: string,
    public detalle: Array<Object>,
    public deposito: Array<Object>
  ) {}
}
