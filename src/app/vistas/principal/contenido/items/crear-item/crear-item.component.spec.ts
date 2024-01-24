import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearItemComponent } from './crear-item.component';

describe('CrearItemComponent', () => {
  let component: CrearItemComponent;
  let fixture: ComponentFixture<CrearItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
