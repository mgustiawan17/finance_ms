import { TestBed } from '@angular/core/testing';

import { OptionLaporanSuratService } from './option-laporan-surat.service';

describe('OptionLaporanSuratService', () => {
  let service: OptionLaporanSuratService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionLaporanSuratService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
