export class Evento {
  constructor(
    public tipo: string,
    public codigoEvento: string,
    public descripcion: string,
    public idPuntoVenta: number,
    public fecha_inicio: string,
    public cafc: string
  ) {}
}
