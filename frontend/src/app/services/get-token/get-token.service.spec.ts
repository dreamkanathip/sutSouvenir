import { TestBed } from '@angular/core/testing';

import { GetTokenService } from './get-token.service';

describe('GetTokenService', () => {
  let service: GetTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
