import { TestBed } from '@angular/core/testing';

import { Lead } from './lead';

describe('LeadService', () => {
  let service: Lead;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lead);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
