import { TestBed } from '@angular/core/testing';

import { SuratCutiService } from './surat-cuti.service';

describe('SuratCutiService', () => {
  let service: SuratCutiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratCutiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
