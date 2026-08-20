import { TestBed } from '@angular/core/testing';
import { SicilService } from './sicil';

describe('SicilService', () => {
  let service: SicilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SicilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
