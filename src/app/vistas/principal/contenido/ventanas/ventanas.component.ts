import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ventanas',
  templateUrl: './ventanas.component.html',
  styleUrls: ['./ventanas.component.scss']
})
export class VentanasComponent implements OnInit {
  constructor(private modalService: NgbModal) {}
  private modalRef: NgbModalRef;
  ngOnInit() {}
  abrirModal(plantilla) {
    this.modalRef = this.modalService.open(plantilla, {
      size: 'lg',
      backdrop: false,
      centered: false
    });
  }
  cerrarModal() {
    this.modalRef.close();
  }
}
