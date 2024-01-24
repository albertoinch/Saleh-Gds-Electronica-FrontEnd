import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigosEspecialesComponent } from './codigos-especiales.component';

describe('CodigosEspecialesComponent', () => {
  let component: CodigosEspecialesComponent;
  let fixture: ComponentFixture<CodigosEspecialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodigosEspecialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigosEspecialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
