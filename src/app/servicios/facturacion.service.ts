import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'ngx-alerts';
import { config } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  constructor(private ngzone: NgZone,
    private http: HttpClient,
    private translate: TranslateService,
    private alertService: AlertService) { }

  public urlApi = config.apiUrl;

  private error(error: any): Promise<any> {
    return error;
  }
  private formateartData(res: Response) {
    return JSON.stringify(res) || {};
  }
  actualizarPagina() {
    this.ngzone.runOutsideAngular(() => {
      location.reload();
    });
  }
  validarNumeros(event: any, item, max = 9999999) {
    const min = 1;
    let numeroValido = false;
    // console.log(event);
    if ((event.which >= 48 && event.which <= 57) || event.which == 46) {
      numeroValido = true;
      const nuevoNumero = parseInt(
        item + '' + String.fromCharCode(event.which)
      );
      // Verificar al valor maximo y al valor minimo posible
      if (
        (nuevoNumero <= max && nuevoNumero >= min) ||
        Number.isNaN(nuevoNumero)
      ) {
        numeroValido = true;
      } else {
        // console.log('El numero maximo no es valido');
        event.preventDefault();
        numeroValido = false;
      }
    } else {
      if (event.which === 8) {
        numeroValido = true;
      } else {
        event.preventDefault();
        numeroValido = false;
      }
    }

    return numeroValido;
  }
  validarFecha(fecha) {
    // const expresionRegular = /^([012][1-9]|3[01])(\/)(0[1-9]|1[012])\2(\d{4})$/;   // formato dd/mm/yyyy
    const expresionRegularFecha = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/; // formato yyyy-mm-dd
    return expresionRegularFecha.test(fecha);
  }

/*   regenerarVenta(idVenta, datos) {
    console.log("--- datos que llega de anulacion : ",datos);
    const urlRegeneraVenta = `${this.urlApi}factura_regenerar/${idVenta}`;
    return this.http
      .put(urlRegeneraVenta, datos)
      .toPromise()
      .then()
      .catch(this.error);
  } */

  regenerarVentaObs(idVenta, datos) {
    console.log("--- datos que llega de regenerar : ",datos);
    const urlRegeneraVenta = `${this.urlApi}factura/${idVenta}`;
    return this.http
      .put(urlRegeneraVenta, datos)
      .toPromise()
      .then()
      .catch(this.error);
  }
  
}
