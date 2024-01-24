import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UsuarioService } from '../../../servicios/usuario.service';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {
  swActivo: boolean;
  esconder: boolean;
  subMenu: string;
  claseDerecha: string;

  @Output() eventoEsconder = new EventEmitter<boolean>();

  constructor(
    private translate: TranslateService,
    public router: Router,
    private usuarioService: UsuarioService
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
        this.activarPosicion()
      ) {
        this.cambiarBarra();
      }
    });
  }
  public menuBD: any;
  public menu: any;

  ngOnInit() {
    this.swActivo = false;
    this.esconder = false;
    this.subMenu = '';
    this.menu=[];
    this.claseDerecha = 'push-right';
    this.menuBD = localStorage.getItem('menu');
    this.menuBD = JSON.parse(this.menuBD);
    for (let i = 0; i < this.menuBD.length; i++) {
      //const element = this.menuBD[i];
      if (this.menuBD[i].orden === 1) {
        this.menu.push(this.menuBD[i]);
      }
      
    }
    console.log("++++++++++++++++++++++++", this.menuBD.length)
  }

  expandirSubMenu(e: any) {
    if (e === this.subMenu) {
      this.subMenu = '0';
    } else {
      this.subMenu = e;
    }
  }

  activarPosicion(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.claseDerecha);
  }
  cambiarBarra() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.claseDerecha);
  }

  cerrarSesion() {
    this.usuarioService.cerrarSesion();
  }
  activarSoloIconos() {
    this.esconder = !this.esconder;
    this.eventoEsconder.emit(this.esconder);
  }
  getUsuario() {
    return this.usuarioService.getUsuario();
  }
  anio() {
    return new Date().getFullYear();
  }
}
