import { TestBed } from '@angular/core/testing';

import { ListkontrabonService } from './listkontrabon.service';

describe('ListkontrabonService', () => {
  let service: ListkontrabonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListkontrabonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
