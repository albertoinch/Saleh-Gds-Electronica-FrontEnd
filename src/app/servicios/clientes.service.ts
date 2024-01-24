import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';
@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient,
    private ngzone: NgZone) { }

  public urlApi = config.apiUrl;

  private error(error: any): Promise<any> {
    return error;
  }

  getClientes(page,limit, buscarE, buscarT, buscarDoc){
  	const urlClientes = `${this.urlApi}clientes/${page}`;
    return this.http
      .get(urlClientes, {
        params:{
          limit:limit,
          buscarEstado: buscarE,
          buscarClientes: buscarT,
          buscarNroDoc: buscarDoc
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  getCliente(id){
    const urlClientes = `${this.urlApi}cliente/${id}`;
    return this.http
      .get(urlClientes)
      .toPromise()
      .then()
      .catch(this.error);
  }

  putCliente(id, datos){
    const urlClientes = `${this.urlApi}cliente/${id}`;
    return this.http
      .put(urlClientes, datos)
      .toPromise()
      .then()
      .catch(this.error);
  }

  buscarCliente(id){
    const urlClientes = `${this.urlApi}cliente/${id}`;
    return this.http
      .get(urlClientes)
      .toPromise()
      .then()
      .catch(this.error);
  }

  buscarClienteCI(ci, complemento, tipoDoc){
    const urlClientes = `${this.urlApi}cliente/buscar/${ci}`;
    return this.http
      .get(urlClientes, {
        params:{
          complemento: complemento,
          tipoDoc: tipoDoc
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  verificarFecha(fecha) {
    let resultado = false;
    if (fecha != "") {
      const exprT = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/
        ;
      if (!exprT.test(fecha)) {
        resultado = true;
      }
    }
    return resultado;
  }

  verificarEmail(email) {
    let resultado = false;
    if (email != "" && email != undefined) {
      //const expr = /^[_a-zA-Z0-9-]+(.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*(.[a-zA-Z]{2,4})$/;
      const expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!expr.test(email)) {
        resultado = true;
      }
    }
    return resultado;
  }

  postCliente(datos){
    const urlClientes = `${this.urlApi}cliente`;
    return this.http
      .post(urlClientes, datos)
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
