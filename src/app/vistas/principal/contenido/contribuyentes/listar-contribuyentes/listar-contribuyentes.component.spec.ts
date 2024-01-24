import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarContribuyentesComponent } from './listar-contribuyentes.component';

describe('ListarContribuyentesComponent', () => {
  let component: ListarContribuyentesComponent;
  let fixture: ComponentFixture<ListarContribuyentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarContribuyentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarContribuyentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
