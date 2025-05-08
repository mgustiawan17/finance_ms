import { TestBed } from '@angular/core/testing';

import { UsagereportService } from './usagereport.service';

describe('UsagereportService', () => {
  let service: UsagereportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsagereportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
