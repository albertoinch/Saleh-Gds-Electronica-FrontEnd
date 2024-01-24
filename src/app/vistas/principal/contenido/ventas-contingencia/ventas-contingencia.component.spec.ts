import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasContingenciaComponent } from './ventas-contingencia.component';

describe('VentasContingenciaComponent', () => {
  let component: VentasContingenciaComponent;
  let fixture: ComponentFixture<VentasContingenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasContingenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
