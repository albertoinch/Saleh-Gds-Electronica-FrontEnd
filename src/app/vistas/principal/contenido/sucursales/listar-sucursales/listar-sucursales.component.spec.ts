import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSucursalesComponent } from './listar-sucursales.component';

describe('ListarSucursalesComponent', () => {
  let component: ListarSucursalesComponent;
  let fixture: ComponentFixture<ListarSucursalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarSucursalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
