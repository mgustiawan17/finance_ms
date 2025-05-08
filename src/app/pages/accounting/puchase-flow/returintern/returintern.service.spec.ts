import { TestBed } from '@angular/core/testing';

import { ReturinternService } from './returintern.service';

describe('ReturinternService', () => {
  let service: ReturinternService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturinternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
