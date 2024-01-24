import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private http: HttpClient) {}
  private urlAuth = config.apiAuth;
  private urlApi = config.apiUrl;
  public campoNombre = config.campoNombreLdap;
  public campoPassword = config.campoPasswordLdap;

  postIniciarSesion(usuario, clave) {
    const dataUsuario = { username: usuario, password: clave };
    return this.http
      .post(this.urlAuth, dataUsuario, {})
      .toPromise()
      .then()
      .catch(this.error);
  }
  private error(error: any): Promise<any> {
    return error;
  }
  private formateartData(res: Response) {
    return JSON.stringify(res) || {};
  }
  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
  getUsuario() {
    return localStorage.getItem('usuario');
  }
  getRol() {
    return parseInt(localStorage.getItem('rol'));
  }
  getDatosUsuario(idUsuario) {
    const urlGetUsuario = `${this.urlApi}usuario/${idUsuario}`;
    return this.http
      .get(urlGetUsuario)
      .toPromise()
      .then()
      .catch(this.error);
  }
  getValidaRol(reles, rol) {
    if (reles.indexOf(rol) >= 0) {
      return rol;
    }
    return null;
  }

  getUsuarios(page, limit, buscarNombre, buscarUsuario) {
    const urlUsuarios = `${this.urlApi}usuario-grupo/${page}`;
    return this.http
      .get(urlUsuarios, { params: {limit: limit, buscarNombre: buscarNombre, buscarUsuario: buscarUsuario}})
      .toPromise()
      .then()
      .catch(this.error);
  }

  getGrupos() {
    const urlUsuarios = `${this.urlApi}usuario-grupos`;
    return this.http
      .get(urlUsuarios)
      .toPromise()
      .then()
      .catch(this.error);
  }

  updateUsuarioRol(id, data){
    const urlPostUsuario =`${this.urlApi}usuario-grupo/${id}`;
    return this.http
      .put(urlPostUsuario, data)
      .toPromise()
      .then()
      .catch(this.error);
  }

  putUsuarioGrupo(id, data){
    const urlUsuario =`${this.urlApi}usuario-grupo/${id}`;
    return this.http
      .put(urlUsuario, data)
      .toPromise()
      .then()
      .catch(this.error);
  }

  postUsuario(data){
    const urlUsuario =`${this.urlApi}usuario`;
    return this.http
      .post(urlUsuario, data)
      .toPromise()
      .then()
      .catch(this.error);
  }

  putUsuario(id, data){
    const urlUsuario =`${this.urlApi}usuario/${id}`;
    return this.http
      .put(urlUsuario, data)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getToken(idUsuario) {
    const urlGetUsuario = `${this.urlApi}usuario/token/${idUsuario}`;
    return this.http
      .get(urlGetUsuario)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getPerfil(idUsuario) {
    const urlGetUsuario = `${this.urlApi}usuario/${idUsuario}`;
    return this.http
      .get(urlGetUsuario)
      .toPromise()
      .then()
      .catch(this.error);
  }
}
