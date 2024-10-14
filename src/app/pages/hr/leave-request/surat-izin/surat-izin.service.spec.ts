import { TestBed } from '@angular/core/testing';

import { SuratIzinService } from './surat-izin.service';

describe('SuratIzinService', () => {
  let service: SuratIzinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratIzinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
