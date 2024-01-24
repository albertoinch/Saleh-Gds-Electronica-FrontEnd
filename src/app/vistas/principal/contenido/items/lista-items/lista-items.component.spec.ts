import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaItemsComponent } from './lista-items.component';

describe('ListaItemsComponent', () => {
  let component: ListaItemsComponent;
  let fixture: ComponentFixture<ListaItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
