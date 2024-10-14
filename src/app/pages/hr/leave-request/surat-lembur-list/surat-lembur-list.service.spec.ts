import { TestBed } from '@angular/core/testing';

import { SuratLemburListService } from './surat-lembur-list.service';

describe('SuratLemburListService', () => {
  let service: SuratLemburListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratLemburListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
