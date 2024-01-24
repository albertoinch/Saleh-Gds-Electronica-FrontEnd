import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarItemComponent } from './editar-item.component';

describe('EditarItemComponent', () => {
  let component: EditarItemComponent;
  let fixture: ComponentFixture<EditarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
