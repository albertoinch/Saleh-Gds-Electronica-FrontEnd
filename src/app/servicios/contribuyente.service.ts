import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ContribuyenteService {
    constructor(private http: HttpClient) {}
    private urlApi = config.apiUrl;

    private error(error: any): Promise<any> {
        return error;
    }

    getContribuyentes(page, limit, buscarNombre) {
        const urlContribuyentes = `${this.urlApi}contribuyente/${page}`;
        return this.http
            .get(urlContribuyentes, { params: {limit: limit, buscarNombre: buscarNombre}})
            .toPromise()
            .then()
            .catch(this.error);
    }

    postContribuyente(datos) {
        const urlContribuyentes = `${this.urlApi}contribuyente`;
        return this.http
            .post(urlContribuyentes, datos)
            .toPromise()
            .then()
            .catch(this.error);
    }

    putContribuyente(id, datos) {
        const urlContribuyentes = `${this.urlApi}contribuyente/${id}`;
        return this.http
            .put(urlContribuyentes, datos)
            .toPromise()
            .then()
            .catch(this.error);
    }

    get() {
        const urlContribuyentes = `${this.urlApi}contribuyentes`;
        return this.http
            .get(urlContribuyentes, {})
            .toPromise()
            .then()
            .catch(this.error);
    }
}