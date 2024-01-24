import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../router.animations';
// import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../app/servicios/usuario.service';
import { NgForm } from '@angular/forms';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.scss'],
  animations: [routerTransition()]
})
export class AccesoComponent implements OnInit {
  @ViewChild('formLogin', { static: true }) formLogin: NgForm;
  constructor(
    private translate: TranslateService,
    public router: Router,
    private usuarioService: UsuarioService,
    private alertService: AlertService
  ) {
    this.translate.addLangs(['es']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }
  public usuario: any;
  public clave: any;

  ngOnInit() {}
  verificandoUsuario() {
    this.usuarioService
      .postIniciarSesion(
        this.formLogin.value.usuario,
        this.formLogin.value.clave
      )
      .then(
        data => {
          if (data.status) {
            if (data.status && data.status !== 200) {
              this.alertService.danger('Error: ' + data.error.mensaje);
              this.router.navigate(['/acceso']);
            }
          } else {
            /*const rolPortal = this.usuarioService.getValidaRol(
              data.roles,
              'portal'
            );*/
            if (data.datos.usuario.cargo === "TEMPORAL") {
              this.alertService.warning('Ud. no tiene rol asignado, comuniquese con el ADMINISTRADOR');
              this.router.navigate(['/acceso']);
            }else{

              console.log(data);

              localStorage.setItem('token', data.token);
              localStorage.setItem('usuario', data.datos.usuario.usuario);
              localStorage.setItem('rol', data.datos.usuario.id_grupo);
              localStorage.setItem('id', data.datos.usuario.id_usuario);
              localStorage.setItem('sucursal', data.datos.usuario.sucursal);
              localStorage.setItem('puntoVenta', data.datos.usuario.puntoVenta);
              localStorage.setItem('menu', JSON.stringify(data.datos.menu));
              //localStorage.setItem('rol', rolPortal);
              this.router.navigate(['/ventas']);
            }
          }
        },
        err => {
          console.log('err', err);
        }
      );
  }
}
