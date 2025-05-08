import { TestBed } from '@angular/core/testing';

import { ReviewkontrabonService } from './reviewkontrabon.service';

describe('ReviewkontrabonService', () => {
  let service: ReviewkontrabonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewkontrabonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
