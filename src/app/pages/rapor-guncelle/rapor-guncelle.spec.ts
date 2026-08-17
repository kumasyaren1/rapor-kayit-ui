import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaporGuncelle } from './rapor-guncelle';
import { RaporService } from '../../services/rapor';
import { ReferansService } from '../../services/referans';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('RaporGuncelle', () => {
  let component: RaporGuncelle;
  let fixture: ComponentFixture<RaporGuncelle>;

  const mockRapor = {
    id: '123',
    raporId: '123',
    raporKayitNo: 'RPR-2026-0001',
    vergiKimlikNo: '1234567890',
    tcKimlikNo: null,
    adSoyadUnvan: 'ABC Teknoloji A.Ş.',
    duzenlemeTarihi: '2026-07-25',
    aciklama: '2026 yılı genel teftiş çalışmaları.',
    durum: 'KAYITLI',
    anaRaporTuruId: '1',
    anaRaporTuruKodu: 'TEFTIS',
    anaRaporTuruAdi: 'Teftiş Raporu',
    raporTuruId: '10',
    raporTuruKodu: 'GENEL_TEFTIS',
    raporTuruAdi: 'Genel Teftiş',
    vergiKoduId: '100',
    vergiKodu: '0015',
    vergiKoduAdi: 'Katma Değer Vergisi',
  };

  const fakeRaporService = {
    raporGetir: () => of(mockRapor),
    raporGuncelle: () => of(mockRapor),
  };

  const fakeReferansService = {
    anaRaporTurleriniGetir: () => of([{ id: '1', ad: 'Teftiş Raporu', kod: 'TEFTIS' }]),
    vergiKodlariniGetir: () => of([{ id: '100', ad: '0015 – Katma Değer Vergisi', kod: '0015' }]),
    raporTurleriniGetir: () => of([{ id: '10', ad: 'Genel Teftiş', kod: 'GENEL_TEFTIS' }]),
  };

  const fakeRouter = {
    navigate: () => Promise.resolve(true),
  };

  const fakeMessageService = {
    add: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaporGuncelle],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        { provide: RaporService, useValue: fakeRaporService },
        { provide: ReferansService, useValue: fakeReferansService },
        { provide: Router, useValue: fakeRouter },
        { provide: MessageService, useValue: fakeMessageService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RaporGuncelle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('bileşen başarıyla başlatılmalı', () => {
    expect(component).toBeTruthy();
    expect(component.raporId).toBe('123');
  });

  it('rapor detayları başarıyla yüklenmeli ve forma dolmalı', () => {
    expect(component.form.get('vergiKimlikNo')?.value).toBe('1234567890');
    expect(component.form.get('adSoyadUnvan')?.value).toBe('ABC Teknoloji A.Ş.');
    expect(component.form.get('anaRaporTuruId')?.value).toBe('1');
    expect(component.form.get('raporTuruId')?.value).toBe('10');
  });
});
