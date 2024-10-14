import { TestBed } from '@angular/core/testing';

import { SuratKendaraanService } from './surat-kendaraan.service';

describe('SuratKendaraanService', () => {
  let service: SuratKendaraanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratKendaraanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
