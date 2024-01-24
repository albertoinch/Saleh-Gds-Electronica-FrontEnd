import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  constructor(private http: HttpClient,
    private ngzone: NgZone,) { }
  public urlApi = config.apiUrl;

  private error(error: any): Promise<any> {
    return error;
  }
  
  getPuntosVenta() {
    const urlSucursales = `${this.urlApi}puntoVenta`;
    return this.http
      .get(urlSucursales)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getSucursales() {
    const urlSucursales = `${this.urlApi}sucursales`;
    return this.http
      .get(urlSucursales)
      .toPromise()
      .then()
      .catch(this.error);
  }

  postPuntoVenta(datos) {
    const urlSucursales = `${this.urlApi}puntoVenta`;
    return this.http
      .post(urlSucursales, datos)
      .toPromise()
      .then()
      .catch(this.error);
  }

  postSucursal(datos) {
    const urlSucursales = `${this.urlApi}sucursal`;
    return this.http
      .post(urlSucursales, datos)
      .toPromise()
      .then()
      .catch(this.error);
  }

  indexPuntoVenta(page, limit, buscarEstado, buscarNombre, buscarCodigo/* , buscarTipo */) {
    const urlSucursales = `${this.urlApi}puntoVenta/lista/${page}`;
    return this.http
      .get(urlSucursales,{
        params:{
          limit: limit,
          buscarEstado: buscarEstado,
          buscarNombre: buscarNombre,
          buscarCodigo: buscarCodigo
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  indexSucursalPuntoVenta(id, page, limit, buscarEstado, buscarNombre, buscarCodigo) {
    const urlSucursales = `${this.urlApi}puntoVentas/${id}/${page}`;
    return this.http
      .get(urlSucursales,{
        params:{
          limit: limit,
          buscarEstado: buscarEstado,
          buscarNombre: buscarNombre,
          buscarCodigo: buscarCodigo
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  indexSucursales(page, limit, buscarEstado, buscarNombre, buscarCodigo) {
    const urlSucursales = `${this.urlApi}sucursales/${page}`;
    return this.http
      .get(urlSucursales,{
        params:{
          limit: limit,
          buscarEstado: buscarEstado,
          buscarNombre: buscarNombre,
          buscarCodigo: buscarCodigo
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  registrarPunto(id) {
    const urlSucursales = `${this.urlApi}puntoVenta/registrar/${id}`;
    return this.http
      .post(urlSucursales,'')
      .toPromise()
      .then()
      .catch(this.error);
  }

  registrarSucursal(id, body) {
    const urlSucursal = `${this.urlApi}sucursal/${id}`;
    return this.http
      .put(urlSucursal, body)
      .toPromise()
      .then()
      .catch(this.error);
  }

  actualizarPagina() {
    this.ngzone.runOutsideAngular(() => {
      location.reload();
    });
  }

  getSucursal(id){
    const urlSucursal = `${this.urlApi}sucursal/${id}`;
    return this.http
      .get(urlSucursal)
      .toPromise()
      .then()
      .catch(this.error);
    }
    
    cerrarPuntoVenta(id){
      const urlPuntoVenta = `${this.urlApi}puntoVenta/cerrar/${id}`;
      return this.http
        .put(urlPuntoVenta, '')
        .toPromise()
        .then()
        .catch(this.error);
  }

  solicitarCuis(id) {
    const urlSucursales = `${this.urlApi}puntoVenta/cuis`;
    return this.http
      .post(urlSucursales, {
        id: id
      })
      .toPromise()
      .then()
      .catch(this.error);
  }
}
