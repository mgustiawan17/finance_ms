import { TestBed } from '@angular/core/testing';

import { SuratKendaraanListService } from './surat-kendaraan-list.service';

describe('SuratKendaraanListService', () => {
  let service: SuratKendaraanListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratKendaraanListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
