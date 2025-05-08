import { TestBed } from '@angular/core/testing';

import { ReturkontrabonService } from './returkontrabon.service';

describe('ReturkontrabonService', () => {
  let service: ReturkontrabonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturkontrabonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
