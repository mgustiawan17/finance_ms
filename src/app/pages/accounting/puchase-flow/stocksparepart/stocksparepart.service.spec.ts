import { TestBed } from '@angular/core/testing';

import { StocksparepartService } from './stocksparepart.service';

describe('StocksparepartService', () => {
  let service: StocksparepartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StocksparepartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
