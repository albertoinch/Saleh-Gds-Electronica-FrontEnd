import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UsuarioService } from '../../../servicios/usuario.service';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrls: ['./menu-superior.component.scss']
})
export class MenuSuperiorComponent implements OnInit {
  public claseDerecha: string;

  constructor(
    private translate: TranslateService,
    public router: Router,
    public usuarioService: UsuarioService
  ) {
    this.translate.addLangs(['es']);
    this.translate.setDefaultLang('es');
    // const browserLang = this.translate.getBrowserLang();
    // this.translate.use(browserLang.match(/es/) ? browserLang : 'es');
    this.translate.use('es');

    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.menuVisible()
      ) {
        this.mostrarMenu();
      }
    });
  }
  public notificaciones = [
    { tipo: 'Notificacióin A', cantidad: 3 },
    { tipo: 'Notificacióin B', cantidad: 9 },
    { tipo: 'Notificacióin C', cantidad: 2 }
  ];

  ngOnInit() {
    this.claseDerecha = 'push-right';
  }

  menuVisible(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.claseDerecha);
  }

  mostrarMenu() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.claseDerecha);
  }

  cerrarSesion() {
    this.usuarioService.cerrarSesion();
  }
  getUsuario() {
    return this.usuarioService.getUsuario();
  }
}
