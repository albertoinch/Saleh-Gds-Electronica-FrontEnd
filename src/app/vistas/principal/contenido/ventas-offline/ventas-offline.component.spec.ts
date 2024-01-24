import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasOfflineComponent } from './ventas-offline.component';

describe('VentasOfflineComponent', () => {
  let component: VentasOfflineComponent;
  let fixture: ComponentFixture<VentasOfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasOfflineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
