import { TestBed } from '@angular/core/testing';

import { SuratDinasService } from './surat-dinas.service';

describe('SuratDinasService', () => {
  let service: SuratDinasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuratDinasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
