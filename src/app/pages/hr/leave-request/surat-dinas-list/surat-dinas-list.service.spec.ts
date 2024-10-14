import { TestBed } from '@angular/core/testing';

import { SuratDinasListService } from './surat-dinas-list.service';

describe('SuratDinasListService', () => {
  let service: SuratDinasListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratDinasListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
