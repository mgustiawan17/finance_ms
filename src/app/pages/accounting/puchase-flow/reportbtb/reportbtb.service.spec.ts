import { TestBed } from '@angular/core/testing';

import { ReportbtbService } from './reportbtb.service';

describe('ReportbtbService', () => {
  let service: ReportbtbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportbtbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
