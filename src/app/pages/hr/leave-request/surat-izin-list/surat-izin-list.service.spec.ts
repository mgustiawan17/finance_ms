import { TestBed } from '@angular/core/testing';

import { SuratIzinListService } from './surat-izin-list.service';

describe('SuratIzinListService', () => {
  let service: SuratIzinListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratIzinListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
