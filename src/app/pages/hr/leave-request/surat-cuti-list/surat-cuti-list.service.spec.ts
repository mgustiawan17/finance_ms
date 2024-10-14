import { TestBed } from '@angular/core/testing';

import { SuratCutiListService } from './surat-cuti-list.service';

describe('SuratCutiListService', () => {
  let service: SuratCutiListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratCutiListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
