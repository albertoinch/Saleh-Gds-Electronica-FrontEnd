import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegenerarContingenciaComponent } from './regenerar-contingencia.component';

describe('RegenerarContingenciaComponent', () => {
  let component: RegenerarContingenciaComponent;
  let fixture: ComponentFixture<RegenerarContingenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegenerarContingenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegenerarContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
