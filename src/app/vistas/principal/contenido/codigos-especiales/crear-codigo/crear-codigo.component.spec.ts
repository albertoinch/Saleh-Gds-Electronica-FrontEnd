import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCodigoComponent } from './crear-codigo.component';

describe('CrearCodigoComponent', () => {
  let component: CrearCodigoComponent;
  let fixture: ComponentFixture<CrearCodigoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearCodigoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
