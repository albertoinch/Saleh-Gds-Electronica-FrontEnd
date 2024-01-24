import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private http: HttpClient,
    private ngzone: NgZone) { }
   public urlApi = config.apiUrl;

  private error(error: any): Promise<any> {
    return error;
  }

  getEventos(page,limit, buscarE, buscarT){
  	const urlEventos = `${this.urlApi}evento/${page}?limit=${limit}&buscarEstado=${buscarE}&buscarTipo=${buscarT}`;
    return this.http
      .get(urlEventos)
      .toPromise()
      .then()
      .catch(this.error);
  }

  enviarInicio(id){
    const urlEventos = `${this.urlApi}evento/${id}`;
    //const urlEventos = `${this.urlApi}evento/`;
    return this.http
      .delete(urlEventos)
      .toPromise()
      .then()
      .catch(this.error);
  }

  enviarFin(idEvento, fecha){
    const urlEventos = `${this.urlApi}evento/${idEvento}`;
    return this.http
      .put(urlEventos, fecha)
      .toPromise()
      .then()
      .catch(this.error);
  }

  actualizarPagina() {
    this.ngzone.runOutsideAngular(() => {
      location.reload();
    });
  }

  postEvento(data) {
    const urlPostEvento = `${this.urlApi}evento`;
    return this.http
      .post(urlPostEvento, data)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getRepEventos(limit,desde, hasta){
      const urlEventos = `${this.urlApi}eventos/reporte`;
    return this.http
      .get(urlEventos, { params: { limit: limit, desde: desde, hasta: hasta} })
      .toPromise()
      .then()
      .catch(this.error);
  }

   getRepEventosSP(desde, hasta){
      var limit='1000000000000000';
      const urlEventos = `${this.urlApi}eventos/reporte`;
    return this.http
      .get(urlEventos, { params: { limit: limit, desde: desde, hasta: hasta} })
      .toPromise()
      .then()
      .catch(this.error);
  } 
   getEventosSaludReporte(desde, hasta){
      const urlEventos = `${this.urlApi}eventos/salud/reporte`;
    return this.http
      .put(urlEventos, {  desde: desde, hasta: hasta} )
      .toPromise()
      .then()
      .catch(this.error);
  } 

  /*getDescargarPdf( ruta): Observable<any> {
    if (ruta) {
      const urlPdf = `${this.urlApi}${ruta}?desde=2019-10-10&hasta=2019-11-28 23:59:59`;
      return this.http.get(urlPdf, { responseType: 'blob' });
    } else {
      return null;
    }
  }*/
}
