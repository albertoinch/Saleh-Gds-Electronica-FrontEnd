import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFacturaContingenciaComponent } from './crear-factura-contingencia.component';

describe('CrearFacturaContingenciaComponent', () => {
  let component: CrearFacturaContingenciaComponent;
  let fixture: ComponentFixture<CrearFacturaContingenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearFacturaContingenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFacturaContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
