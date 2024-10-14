import { TestBed } from '@angular/core/testing';

import { SisaCutiService } from './sisa-cuti.service';

describe('SisaCutiService', () => {
  let service: SisaCutiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SisaCutiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
