import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';

import { UsuarioService } from '../../../../servicios/usuario.service';
import { TranslateService } from '@ngx-translate/core';

import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  constructor(private alertService: AlertService,
              private translate: TranslateService,
              private usuarioService: UsuarioService,
              private router: Router) { }

  public usuarios={
    persona:{
      nombres: null,
      primer_apellido: null,
      segundo_apellido: null
    },
    rol:[
      {
        id_grupo: null,
        grupo: null
      }
    ],
    estado:null
  };
  public rol: any;

  ngOnInit() {
  	var id = localStorage.getItem("id")
  	this.usuarioService.getPerfil(id).then(data => {
      this.usuarios = data.datos;
      this.rol = data.datos.grupos[0];
      console.log("---------------- datos obtenidos de usuario *---------------")
      console.log(this.usuarios)
    });
  }


}
