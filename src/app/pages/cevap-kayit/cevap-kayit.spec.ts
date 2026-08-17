import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CevapKayit } from './cevap-kayit';
import { RaporService } from '../../services/rapor';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CevapKayit', () => {
  let component: CevapKayit;
  let fixture: ComponentFixture<CevapKayit>;

  const mockRapor = {
    id: '456',
    raporId: '456',
    raporKayitNo: 'RPR-2026-0002',
    vergiKimlikNo: '1234567890',
    tcKimlikNo: null,
    adSoyadUnvan: 'ABC Teknoloji A.Ş.',
    duzenlemeTarihi: '27.07.2026',
    aciklama: '',
    durum: 'KAYITLI',
    anaRaporTuruId: '1',
    anaRaporTuruKodu: 'TEFTIS',
    anaRaporTuruAdi: 'Teftiş Raporu',
    raporTuruId: '10',
    raporTuruKodu: 'GENEL_TEFTIS',
    raporTuruAdi: 'Genel Teftiş',
    vergiKoduId: '100',
    vergiKodu: '0015',
    vergiKoduAdi: '0015 – Katma Değer Vergisi',
  };

  const fakeRaporService = {
    raporGetir: () => of(mockRapor),
    cevapKaydet: () => of(mockRapor),
  };

  const fakeRouter = {
    navigate: () => Promise.resolve(true),
  };

  const fakeMessageService = {
    add: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CevapKayit],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RaporService, useValue: fakeRaporService },
        { provide: Router, useValue: fakeRouter },
        { provide: MessageService, useValue: fakeMessageService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '456' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CevapKayit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('bileşen başarıyla başlatılmalı', () => {
    expect(component).toBeTruthy();
    expect(component.raporId).toBe('456');
  });

  it('rapor bilgileri salt okunur alanlara aktarılmalı', () => {
    expect(component.form.get('vergiKimlikNo')?.value).toBe('1234567890');
    expect(component.form.get('anaRaporTuruAdi')?.value).toBe('Teftiş Raporu');
  });
});
