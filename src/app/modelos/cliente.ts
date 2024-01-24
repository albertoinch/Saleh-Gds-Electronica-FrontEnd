export class Cliente {
  constructor(
    public complemento: string,
    public estado: string,
    public fechaNacimiento: string,
    // public id_cliente: number,
    public numeroDocumento: string,
    public nombreRazonSocial: string,
    public codigoTipoDocumentoIdentidad: string,
    public correo: string,
    public pais: string
  ) {}
}