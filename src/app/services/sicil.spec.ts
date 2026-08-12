import { TestBed } from '@angular/core/testing';

import { Sicil } from './sicil';

describe('Sicil', () => {
  let service: Sicil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sicil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
