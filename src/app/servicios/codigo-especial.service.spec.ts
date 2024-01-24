import { TestBed } from '@angular/core/testing';

import { CodigoEspecialService } from './codigo-especial.service';

describe('CodigoEspecialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodigoEspecialService = TestBed.get(CodigoEspecialService);
    expect(service).toBeTruthy();
  });
});
