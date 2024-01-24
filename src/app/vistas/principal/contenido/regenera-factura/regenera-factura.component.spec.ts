import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegeneraFacturaComponent } from './regenera-factura.component';

describe('RegeneraFacturaComponent', () => {
  let component: RegeneraFacturaComponent;
  let fixture: ComponentFixture<RegeneraFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegeneraFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegeneraFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
