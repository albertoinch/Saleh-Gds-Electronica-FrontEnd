import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { config } from 'src/config/config';

@Injectable() // {providedIn: 'root'}
export class Interceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  public tipoJWTLdap = config.tipoJWTLdap;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${this.tipoJWTLdap} ${localStorage.getItem('token')}`
        }
      });
    }
    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            // console.log('Petición sin errores', event.status);
          }
        },
        error => {
          // realizar tareas de redireccionamiento
          console.log('Error en la interceptor', error);
          console.log('Error en la petición', error.status);
          if (error.error.mensaje.indexOf("Falló la autenticación del token.") == 0 || error.error.mensaje.indexOf("El token expiró.") == 0) {
            this.router.navigate(['/acceso']);
          }
          // console.log('-------------------------> ', error.error.mensaje);
          return catchError(error);
        }
      )
    );
  }
}
