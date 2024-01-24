import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';
@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(private http: HttpClient,) { }
  public urlApi = config.apiUrl;
  private error(error: any): Promise<any> {
    return error;
  }

  getActividades(){
  	const urlActividades = `${this.urlApi}catalogo/ACTIVIDAD`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getCodigoSinA(codigo){
  	const urlActividades = `${this.urlApi}catalogo/codigoSin`;
    return this.http
      .get(urlActividades,{ params:{codigo:codigo} })
      .toPromise()
      .then()
      .catch(this.error);
  }

  getTiposDocumentoIdentidad(){
    const agrupador = 'TIPO DOCUMENTO IDENTIDAD';
  	const urlActividades = `${this.urlApi}catalogo/${agrupador}`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getMetodosPago(){
    const agrupador = 'METODO PAGO';
  	const urlActividades = `${this.urlApi}catalogo/${agrupador}`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getUnidadMedida(){
    const agrupador = 'UNIDAD MEDIDA'
  	const urlActividades = `${this.urlApi}catalogo/${agrupador}`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getPaises(){
    const codigoPais = 'CODIGO PAIS';
  	const urlActividades = `${this.urlApi}catalogo/${codigoPais}`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getMotivoEvento(){
    const motivoEvento = 'MOTIVO EVENTO';
  	const urlActividades = `${this.urlApi}catalogo/${motivoEvento}`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getMotivoAnulacion(){
    const motivoAnulacion = 'MOTIVO ANULACION';
  	const urlActividades = `${this.urlApi}catalogo/${motivoAnulacion}`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getTipoMoneda(){
    const tipoMoneda = 'TIPO MONEDA';
  	const urlActividades = `${this.urlApi}catalogo/${tipoMoneda}`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getTipoPuntoVenta(){
    const tipoPuntoVenta = 'PUNTO VENTA';
    const urlTipoPuntoVenta = `${this.urlApi}catalogo/${tipoPuntoVenta}`;
    return this.http
      .get(urlTipoPuntoVenta)
      .toPromise()
      .then()
      .catch(this.error);
  }

  //--NO EXISTE EN EL CATALOGO
  getTipoDocumentoFiscal(){
  	const urlActividades = `${this.urlApi}catalogo/TIPO_DOCUMENTO_FISCAL`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getTipoDocumentoSector(){
    const tipoDocumentoSector = 'TIPO DOCUMENTO SECTOR';
  	const urlActividades = `${this.urlApi}catalogo/${tipoDocumentoSector}`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }

  getCatalogo(agrupador){
  	const urlActividades = `${this.urlApi}catalogo`;
    return this.http
      .get(urlActividades,{ params:{ agrup:agrupador } })
      .toPromise()
      .then()
      .catch(this.error);
  }


  //NO EXISTE EN EL CATALOGO
  getCodigosEspeciales(){
  	const urlActividades = `${this.urlApi}catalogo/CODIGOS_ESPECIALES`;
    return this.http
      .get(urlActividades)
      .toPromise()
      .then()
      .catch(this.error);
  }
}
