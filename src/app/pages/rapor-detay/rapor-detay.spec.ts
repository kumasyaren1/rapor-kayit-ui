import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaporDetay } from './rapor-detay';

describe('RaporDetay', () => {
  let component: RaporDetay;
  let fixture: ComponentFixture<RaporDetay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaporDetay],
    }).compileComponents();

    fixture = TestBed.createComponent(RaporDetay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
