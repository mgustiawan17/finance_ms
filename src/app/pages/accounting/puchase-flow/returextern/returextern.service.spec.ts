import { TestBed } from '@angular/core/testing';

import { ReturexternService } from './returextern.service';

describe('ReturexternService', () => {
  let service: ReturexternService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturexternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
