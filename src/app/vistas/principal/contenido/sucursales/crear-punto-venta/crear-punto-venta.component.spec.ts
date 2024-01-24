import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPuntoVentaComponent } from './crear-punto-venta.component';

describe('CrearPuntoVentaComponent', () => {
  let component: CrearPuntoVentaComponent;
  let fixture: ComponentFixture<CrearPuntoVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPuntoVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPuntoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
