import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPuntosVentaComponent } from './listar-puntos-venta.component';

describe('ListarPuntosVentaComponent', () => {
  let component: ListarPuntosVentaComponent;
  let fixture: ComponentFixture<ListarPuntosVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarPuntosVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPuntosVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
