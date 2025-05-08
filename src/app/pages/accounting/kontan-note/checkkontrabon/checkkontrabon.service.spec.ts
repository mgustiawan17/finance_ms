import { TestBed } from '@angular/core/testing';

import { CheckkontrabonService } from './checkkontrabon.service';

describe('CheckkontrabonService', () => {
  let service: CheckkontrabonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckkontrabonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
