import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CodigoEspecialService {

  constructor(private http: HttpClient,
    private ngzone: NgZone) { }
  
  public urlApi = config.apiUrl;

  private error(error: any): Promise<any> {
    return error;
  }

  getCodigos(page, buscarTipo, buscarEstado, buscarFechaFin, limit) {
    console.log("...datos q lleguas ", buscarTipo, buscarEstado, buscarFechaFin, limit)
    const urlCodigos = `${this.urlApi}codigoEspecial/lista/${page}`;
    return this.http
      .get(urlCodigos, {
        params: {
          buscarTipo: buscarTipo,
          buscarEstado: buscarEstado,
          buscarFechaFin: buscarFechaFin,
          limit: limit
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  postCodigos(data) {
    const urlPostCodigos = `${this.urlApi}codigoEspecial`;
    return this.http
      .post(urlPostCodigos, data)
      .toPromise()
      .then()
      .catch(this.error);
  }

  actualizarPagina() {
    this.ngzone.runOutsideAngular(() => {
      location.reload();
    });
  }
  
}
