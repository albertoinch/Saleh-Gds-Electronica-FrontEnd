export class FacturaContingencia {
    constructor(
      public codigoSucursal: string,
      public codigoPuntoVenta: string,
      public codigoTipoDocumentoIdentidad: string,
      public numeroDocumento: string,
      public complemento: string,
      public nombreRazonSocial: string,
      public caed: string,
      public fechaEmision: Date,
      public tipoCambio: string,
      public codigoMetodoPago: number,
      public descuentoAdicional: number,
      public montoGiftCard: number,
      public numeroTarjeta: string,
      public numeroTarjeta1: string,
      public numeroTarjeta2: string,
      public tipoEmision: number,
      public numeroFactura: string,
      public codigoExcepcionDocumento: number,
      public pais: string,
      public cafc: string,
      public detalle: Array<Object>
    ) {}
  }
  
