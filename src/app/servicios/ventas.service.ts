import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../config/config';
import { AlertService } from 'ngx-alerts';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(
  	private http: HttpClient,
  	private alertService: AlertService,
    private translate: TranslateService) { }
    public urlApi = config.apiUrl;


  private error(error: any): Promise<any> {
    return error;
  }

  getVentas(page, buscarNit, buscarCliente, buscarEstado, buscarNroF, limit, desde, hasta, tipoEmision, posterior) {
    const urlVentas = `${this.urlApi}ventas/${page}?limit=${limit}&buscarEstado=${buscarEstado}&buscarNroF=${buscarNroF}&buscarNit=${buscarNit}&buscarCliente=${buscarCliente}&desde=${desde}&hasta=${hasta}&buscarTipoEmision=${tipoEmision}&posterior=${posterior}`;/* */
    return this.http
      .get(urlVentas)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getDescargarPdf(id, ruta): Observable<any> {
    if (ruta) {
      const urlPdf = `${this.urlApi}${ruta}/${id}`;
      return this.http.get(urlPdf, { responseType: 'blob' });
    } else {
      return null;
    }
  }

  getAbrirPdf(id, ruta) {
    if (ruta) {
      const urlPdf = `${this.urlApi}${ruta}/${id}`;
      return this.http.get(urlPdf, { responseType: 'blob' }).subscribe(
        data => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const urlVirtual = window.URL.createObjectURL(blob);
          window.open(urlVirtual);
        },
        err => {
          this.alertService.danger(
            this.translate.instant('error.ventas.pdfVenta')
          );
        }
      );
    } else {
      return null;
    }
  }

  getAbrirXml(cuf, ruta) {
    if (ruta) {
      const urlPdf = `${this.urlApi}${ruta}/${cuf}`;
      return this.http.get(urlPdf, { responseType: 'blob' }).subscribe(
        data => {
          const blob = new Blob([data], { type: 'text/xml' });
          const urlVirtual = window.URL.createObjectURL(blob);
          window.open(urlVirtual);
        },
        err => {
          this.alertService.danger(
            this.translate.instant('error.ventas.pdfVenta')
          );
        }
      );
    } else {
      return null;
    }
  }

  postVenta(data) {
    const urlPostVenta = `${this.urlApi}factura`;
    return this.http
      .post(urlPostVenta, data)
      .toPromise()
      .then()
      .catch(this.error);
  }

  validarProductos(aData) {
    let valido = true;
    aData.map((item, index) => {
      console.log(item);
      if (!item.codigoProducto || !item.cantidad || !item.unidadMedida || !item.precioUnitario) {
        valido = false;
      }
    });
    return valido;
  }

  anularVenta(idVenta, datos) {
    const urlAnularVenta = `${this.urlApi}factura/${idVenta}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: datos
    };
    return this.http
      .delete(urlAnularVenta, options)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getRepVentasEmitidas(limit,desde, hasta, buscarEstado, buscarNroCliente, buscarTipoDoc){
    const urlVentasEmitidas = `${this.urlApi}ventaReporte`;
    return this.http
      .get(urlVentasEmitidas,{
        params: {
          limit: limit,
          desde: desde,
          hasta: hasta,
          buscarEstado: buscarEstado,
          buscarNroCliente: buscarNroCliente,
          buscarTipoDoc: buscarTipoDoc
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  getRepVentasEmitidasSP(desde, hasta, buscarEstado, buscarNroCliente, buscarTipoDoc){
    const urlVentasEmitidas = `${this.urlApi}ventaPdf`;
    return this.http.get(urlVentasEmitidas, {
      params: {
        desde: desde,
        hasta: hasta,
        buscarEstado: buscarEstado,
        buscarNroCliente: buscarNroCliente,
        buscarTipoDoc: buscarTipoDoc
      },
      responseType: 'blob'
    }).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const urlVirtual = window.URL.createObjectURL(blob);
        window.open(urlVirtual);
      },
      err => {
        this.alertService.danger(
          this.translate.instant('error.ventas.pdfVenta')
        );
      }
    );
  }

  getRepVentasCantidadSP(desde, hasta){
      const urlVentasCantidad = `${this.urlApi}ventaCantidad`;
    return this.http
      .get(urlVentasCantidad, {
        params: {
          desde: desde,
          hasta: hasta
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  postPaquete(){
    const urlPostPaquete =`${this.urlApi}venta`;
    return this.http
      .post(urlPostPaquete,'')
      .toPromise()
      .then()
      .catch(this.error);
  }

  getVentasOffline(page, buscarCliente, buscarEstado, buscarNroF, limit, desde, hasta) {
    const urlVentas = `${this.urlApi}ventaOffline/${page}`;
    return this.http
      .get(urlVentas,{
        params:{
          limit: limit,
          buscarEstado: buscarEstado,
          buscarNroF: buscarNroF,
          buscarCliente: buscarCliente,
          desde: desde,
          hasta: hasta
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

   buscarVenta(id){
    const urlVenta = `${this.urlApi}factura/${id}/estado`;
    return this.http
      .get(urlVenta)
      .toPromise()
      .then()
      .catch(this.error);
  }


  /*enviarCorreo(id){
    const urlCorreo = `${this.urlApi}cliente_send/${id}`;
    return this.http
      .get(urlCorreo)
      .toPromise()
      .then()
      .catch(this.error);
  }*/

  getVentasContingencia(page, buscarCliente, buscarEstado, buscarNroF, limit, desde, hasta) {
    const urlVentas = `${this.urlApi}venta/contingencia/${page}`;
    return this.http
      .get(urlVentas,{
        params:{
          limit: limit,
          buscarEstado: buscarEstado,
          buscarNroF: buscarNroF,
          buscarCliente: buscarCliente,
          desde: desde,
          hasta: hasta
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  getVentasPorPeriodo(desde, hasta) {
    const urlVentas = `${this.urlApi}ventaMensual`;
    return this.http
      .get(urlVentas, {
        params: {
          desde: desde,
          hasta: hasta
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  postDeposito(id, data) {
    const urlPostVenta = `${this.urlApi}venta/${id}`;
    return this.http
      .post(urlPostVenta, data)
      .toPromise()
      .then()
      .catch(this.error);
  }
}
