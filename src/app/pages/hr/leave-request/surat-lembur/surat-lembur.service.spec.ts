import { TestBed } from '@angular/core/testing';

import { SuratLemburService } from './surat-lembur.service';

describe('SuratLemburService', () => {
  let service: SuratLemburService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratLemburService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
