export class Item {
    constructor(
      public actividad_economica: string,
      public codigo: string,
      public codigo_sin: string,
      public descripcion: number,
      public precio_unitario: number,
      public codigo_moneda: string,
      public codigo_unidad: string,
      public tipo_documento_fiscal: string,
      public tipo_documento_sector: string
    ) {}
  }