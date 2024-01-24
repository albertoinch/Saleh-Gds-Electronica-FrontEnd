import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../../servicios/usuario.service';
import { ContribuyenteService } from '../../../../../servicios/contribuyente.service';
import { SucursalService } from '../../../../../servicios/sucursal.service';
import { AlertService } from 'ngx-alerts';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
//para modal
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioRol } from '../../../../../modelos/usuario-rol';
import { Router, ActivatedRoute } from '@angular/router';
import { Rol } from '../../../../../modelos/rol';
@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
    private alertService: AlertService,
  	private translate: TranslateService,
    private modalService: NgbModal,
    private contribuyenteService: ContribuyenteService,
    private sucursalService: SucursalService,
    private router: Router) { }

  public usuarios: any;
  limit: any;
  paginacion = { "total": 25626, "cantidad": 20, "porPagina": 20, "paginaActual": 1, "totalPaginas": 1282};
  buscarNombre: any;
  buscarUsuario:any;
  nombre:any;
  usuario:any;
  //variables de modal
  private modalRef: NgbModalRef;
  public modalData: any;
  public modalSeccion: string;
  public modalTitulo: any;
  idUsuario:any;
  idUsuarioGrupo:any;
  datosUsuario:any;//para el nombre del usuario
  listaPuntosVenta:any;
  public estado:any;
  public est:any;
  public checkedi:any;

  public rol_actual: any;
  public usuario_rol: UsuarioRol = {
    fidUsuario:null,
    fidGrupo:null
  };
  listaContribuyentes:any;
  roles: any;
  public usuarioDatos = {
    fid_contribuyente:null,
    fidGrupo:null,
    estado:null
  }
  ngOnInit() {
    this.actualizarDatos();
  }

  actualizarDatos() {
    this.usuarios = [];
    this.limit = 10;
    this.buscarNombre = "";
    this.buscarUsuario = "";
    this.nombre = false;
    this.usuario = false;

    this.contribuyenteService.get().then(contribuyente=>{
      this.listaContribuyentes = contribuyente.datos
    });

    this.sucursalService.getPuntosVenta().then(data=>{
    	this.listaPuntosVenta = data.datos
    });
    
    this.paginar(1, this.limit, this.buscarNombre, this.buscarUsuario);
  }

  paginar(page: number, limit, buscarNombre, buscarUsuario) { 
    if (page < 1 || !page) {
        return;
    }
    this.usuarios = [];
    this.usuarioService.getUsuarios(page, limit, buscarNombre, buscarUsuario).then(data => {
      if (data.finalizado) {
        this.usuarios = data.datos;
        this.paginacion.total = data.paginacion.totalRegistros;
        this.paginacion.cantidad = data.paginacion.cantidad;
        this.paginacion.totalPaginas = data.paginacion.paginas;
        this.paginacion.paginaActual = parseInt(data.paginacion.paginaActual);
       }else{
        console.log("error",data.error.mensaje)
        this.alertService.danger( this.translate.instant(data.error.mensaje));
      }
    }).catch(error=>{
      console.log("error",error)
    });
  }

  casoBusqueda(caso) {
    this.buscarNombre=""
    this.buscarUsuario = "";

    switch (caso) {
      //estado
      case 1:
        this.usuario = true;
        this.nombre = false;
        break;
      //nombre
      case 2:
        this.usuario = false;
        this.nombre = true;
        break;
      default:
          break;
      }
  }

  buscar() {
    if (this.buscarNombre != "" ||  this.buscarUsuario != "") {
      this.paginar(1,this. limit, this.buscarNombre, this.buscarUsuario);
    }
  }
  close() {

    this.nombre = false;
    this.usuario = false;

    this.buscarNombre = "";
    this.buscarUsuario = "";

    this.paginar(1,this. limit, this.buscarNombre, this.buscarUsuario);
  }

  abrirModal(plantilla, aData) {
    this.modalTitulo = this.translate.instant('modal.tituloUsuario');
    this.usuarioService.getGrupos().then(suc=>{
      this.roles = suc.datos
    });
    this.checkedi = false
    this.modalData = aData;
    this.idUsuario = this.modalData.id_usuario;
    this.idUsuarioGrupo = this.modalData.grupos[0].usuario_grupo.id_usuario_grupo;

    if (this.modalData.persona.segundo_apellido) {
      this.datosUsuario = `${this.modalData.persona.nombres} ${this.modalData.persona.primer_apellido} ${this.modalData.persona.segundo_apellido}`;
    } else {
      this.datosUsuario = `${this.modalData.persona.nombres} ${this.modalData.persona.primer_apellido}`;
    }
    this.usuarioDatos.fid_contribuyente = this.modalData.fid_contribuyente

    this.est = this.modalData.estado;
    this.rol_actual = this.modalData.grupos[0].grupo;
    if (this.est === 'ACTIVO') {
      this.checkedi = true;
    }if (this.est === 'INACTIVO') {
      this.checkedi = false;
    }

    this.usuario_rol.fidGrupo = this.modalData.grupos[0].id_grupo;
    this.usuario_rol.fidUsuario = this.modalData.id_usuario;


    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  abrirModalPost(plantilla, aData) {
    this.modalTitulo = this.translate.instant('modal.tituloUsuario');
    this.checkedi = false
    aData.fid_persona = 1;
    this.modalData = aData;

    this.est = this.modalData.estado;
    if (this.est === 'ACTIVO') {
      this.checkedi = true;
    } if (this.est === 'INACTIVO') {
      this.checkedi = false;
    }

    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }

  cerrarModal() {
    this.modalRef.close(this.usuarioService);
  }

  token(item) {
    this.usuarioService.getToken(item.id_usuario).then(res => {
      prompt('Token:', res.token);
      console.log(res.token);
    });
  }

  getRol() {
    return this.usuarioService.getRol();
  }

  permiteCrear(){
    const currentRol= this.getRol();
    if (Rol.Admin === currentRol) {
        return true;
    } else
      return false;
  }
  toggleVisibility(e){
    this.checkedi= e.target.checked;
  }

  crearRegistro() {
    this.usuarioService.postUsuario(this.modalData).then(data => {
      if (data.finalizado) {
           this.alertService.success(
              this.translate.instant('mensaje.usuario.editarUsuario')
            );
        this.actualizarDatos();
      }else{
        this.alertService.danger(
              this.translate.instant('mensaje.usuario.errorActivo')
        );
      }
    });
  }

  editarRegistro() {
    if (!this.usuario_rol.fidGrupo || !this.usuario_rol.fidUsuario || !this.usuarioDatos.fid_contribuyente) {
      this.alertService.danger(
        this.translate.instant('error.ventas.requerido')
      );
    } else {
      if (this.checkedi) {
        this.usuarioDatos.estado = 'ACTIVO'
      } else {
        this.usuarioDatos.estado = 'INACTIVO'
      }
      this.usuarioDatos.fidGrupo = this.usuario_rol.fidGrupo;
      this.usuarioService.putUsuario(this.idUsuario, this.usuarioDatos).then(data => {
          if (data.finalizado) {
               this.alertService.success(
                  this.translate.instant('mensaje.usuario.editarUsuario')
                );
            this.actualizarDatos();
          }else{
            this.alertService.danger(
                  this.translate.instant('mensaje.usuario.errorActivo')
            );
          }
      });
    }
  }
}
