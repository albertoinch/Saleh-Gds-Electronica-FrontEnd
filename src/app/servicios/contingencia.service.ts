import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';
@Injectable({
  providedIn: 'root'
})
export class ContingenciaService {

  constructor(private http: HttpClient) { }
  public urlApi = config.apiUrl;

  private error(error: any): Promise<any> {
    return error;
  }
  postContingenciaItems(data) {
    //const urlItems = `${this.urlApi}contingencia/factura`;
    const urlPostVenta = `${this.urlApi}factura`;
    return this.http
      .post(urlPostVenta, data)
      .toPromise()
      .then()
      .catch(this.error);
  }

  postPaquete(){
    const urlPostPaquete =`${this.urlApi}contingencia`;
    return this.http
      .post(urlPostPaquete,'')
      .toPromise()
      .then()
      .catch(this.error);
  }

  anularVentaC(idVenta, datos) {
    const urlAnularVenta = `${this.urlApi}contingencia/${idVenta}`;
    return this.http
      .put(urlAnularVenta, datos)
      .toPromise()
      .then()
      .catch(this.error);
  }

  regenerarVentaCObs(idVenta, datos) {
    const urlRegeneraVenta = `${this.urlApi}contingencia/regenerar_obs/${idVenta}`;
    console.log(idVenta, urlRegeneraVenta, datos)
    return this.http
      .put(urlRegeneraVenta, datos)
      .toPromise()
      .then()
      .catch(this.error);
  }
}
