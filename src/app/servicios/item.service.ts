import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient,
    private ngzone: NgZone,) { }

  public urlApi = config.apiUrl;

  private error(error: any): Promise<any> {
    return error;
  }
  getItems() {
    const urlItems = `${this.urlApi}item`;
    return this.http
      .get(urlItems)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getIndexItems(page, buscarActividad, buscarCodigo, buscarCodigoSin, limit) {
    const urlItems = `${this.urlApi}items/${page}`;
    return this.http
      .get(urlItems,{
        params:{
          buscarActividad: buscarActividad,
          buscarCodigo: buscarCodigo,
          buscarCodigoSin: buscarCodigoSin,
          limit: limit
        }
      })
      .toPromise()
      .then()
      .catch(this.error);
  }

  getCatalogo() {
    const urlCatalogo = `${this.urlApi}item/catalogo`;
    return this.http
      .get(urlCatalogo)
      .toPromise()
      .then()
      .catch(this.error);
  }

  postItem(data) {
    const urlPostItem = `${this.urlApi}item`;
    return this.http
      .post(urlPostItem, data)
      .toPromise()
      .then()
      .catch(this.error);
  }
    
  postSolicitud(idItem){
    const urlPostSItem = `${this.urlApi}item/solicitud/${idItem}`;
    return this.http
      .post(urlPostSItem,'')
      .toPromise()
      .then()
      .catch(this.error);
      
  }

  postValidacion(idItem){
    const urlPostVItem = `${this.urlApi}item/validacion/${idItem}`;
    return this.http
      .post(urlPostVItem,'')
      .toPromise()
      .then()
      .catch(this.error); 
  }

  actualizarPagina() {
    this.ngzone.runOutsideAngular(() => {
      location.reload();
    });
  }

  buscarItem(codigoItem){
    const urlGetOneItem = `${this.urlApi}item/${codigoItem}`;
    return this.http
      .get(urlGetOneItem)
      .toPromise()
      .then()
      .catch(this.error);
  }

  countItemByCode(codigoItem){
    var numberOfItems = 0;
    const items = this.getItems().then(res => res.map(item => {
      if(item.codigo === codigoItem){
        numberOfItems = numberOfItems + 1;
      }
    }));
    return numberOfItems;
  }

  putItem(codigoItem, item){
    const urlPutItem = `${this.urlApi}item/${codigoItem}`;
    return this.http
      .put(urlPutItem, item)
      .toPromise()
      .then()
      .catch(this.error);
  }
}
