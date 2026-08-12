import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaporOlustur } from './rapor-olustur';

describe('RaporOlustur', () => {
  let component: RaporOlustur;
  let fixture: ComponentFixture<RaporOlustur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaporOlustur],
    }).compileComponents();

    fixture = TestBed.createComponent(RaporOlustur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
