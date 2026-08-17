import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { SicilService } from '../../services/sicil';
import { ReferansService } from '../../services/referans';
import { RaporService } from '../../services/rapor';

import { AnaRaporTuruResponse, RaporTuruResponse, VergiKoduResponse } from '../../models/referans';

@Component({
  selector: 'app-rapor-olustur',
  imports: [ButtonModule, SelectModule, ToastModule, ReactiveFormsModule],
  providers: [MessageService], // toast bildirimleri için
  templateUrl: './rapor-olustur.html',
  styleUrl: './rapor-olustur.scss',
})
export class RaporOlustur implements OnInit {
  anaRaporTurleri: AnaRaporTuruResponse[] = [];
  raporTurleri: RaporTuruResponse[] = [];
  vergiKodlari: VergiKoduResponse[] = [];
  sonOlusturulanRaporNo: string | null = null;

  raporForm = new FormGroup({
    vergiKimlikNo: new FormControl('', { nonNullable: true }),
    tcKimlikNo: new FormControl('', { nonNullable: true }),
    adSoyadUnvan: new FormControl({ value: '', disabled: true }, { nonNullable: true }),

    anaRaporTuruId: new FormControl<string | null>(null, { validators: Validators.required }),
    raporTuruId: new FormControl<string | null>(
      { value: null, disabled: true },
      { validators: Validators.required },
    ),
    vergiKoduId: new FormControl<string | null>(null, { validators: Validators.required }),
    duzenlemeTarihi: new FormControl('', { nonNullable: true, validators: Validators.required }),
    aciklama: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private sicilService: SicilService,
    private referansService: ReferansService,
    private raporService: RaporService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    // Sayfa açılır açılmaz iki bağımsız dropdown'ı dolduruyoruz.
    // "Rapor Türü" ise ana rapor türü seçilmeden dolmaz (cascading).
    this.referansService
      .anaRaporTurleriniGetir()
      .subscribe((veri) => (this.anaRaporTurleri = veri));

    this.referansService.vergiKodlariniGetir().subscribe((veri) => (this.vergiKodlari = veri));
  }

  anaRaporTuruDegisti(): void {
    const anaRaporTuruId = this.raporForm.controls.anaRaporTuruId.value;

    this.raporForm.controls.raporTuruId.reset();
    this.raporTurleri = [];

    if (!anaRaporTuruId) {
      this.raporForm.controls.raporTuruId.disable();
      return;
    }

    this.raporForm.controls.raporTuruId.enable();
    this.referansService
      .raporTurleriniGetir(anaRaporTuruId)
      .subscribe((veri) => (this.raporTurleri = veri));
  }

  mukellefSorgula(): void {
    const vergiKimlikNo = this.raporForm.controls.vergiKimlikNo.value.trim();
    const tcKimlikNo = this.raporForm.controls.tcKimlikNo.value.trim();

    const vknGecerli = vergiKimlikNo.length === 10;
    const tcknGecerli = tcKimlikNo.length === 11;

    if (!vknGecerli && !tcknGecerli) {
      this.raporForm.controls.adSoyadUnvan.reset();
      return;
    }

    this.sicilService
      .mukellefSorgula(vknGecerli ? vergiKimlikNo : undefined, tcknGecerli ? tcKimlikNo : undefined)
      .subscribe({
        next: (mukellef) => this.raporForm.controls.adSoyadUnvan.setValue(mukellef.adSoyadUnvan),
        error: () => {
          this.raporForm.controls.adSoyadUnvan.reset();
          this.messageService.add({
            severity: 'warn',
            summary: 'Mükellef bulunamadı',
            detail: 'Girilen VKN/TCKN ile eşleşen bir mükellef yok.',
          });
        },
      });
  }

  kaydet(): void {
    if (this.raporForm.invalid) {
      this.raporForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Eksik bilgi',
        detail: 'Lütfen zorunlu alanları doldurun.',
      });
      return;
    }

    const v = this.raporForm.getRawValue();

    this.raporService
      .raporOlustur({
        vergiKimlikNo: v.vergiKimlikNo || undefined,
        tcKimlikNo: v.tcKimlikNo || undefined,
        anaRaporTuruId: v.anaRaporTuruId!,
        raporTuruId: v.raporTuruId!,
        vergiKoduId: v.vergiKoduId!,
        duzenlemeTarihi: v.duzenlemeTarihi,
        aciklama: v.aciklama || undefined,
      })
      .subscribe({
        next: (rapor) => {
          this.sonOlusturulanRaporNo = rapor.raporKayitNo;

          this.messageService.add({
            severity: 'success',
            summary: 'Rapor oluşturuldu',
            detail: `Rapor kayıt no: ${rapor.raporKayitNo}`,
          });
          this.raporForm.reset();
          this.raporForm.controls.raporTuruId.disable();
        },
        error: (hata) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: hata.error?.message ?? 'Rapor oluşturulamadı.',
          });
        },
      });
  }

  iptalEt(): void {
    this.raporForm.reset();
    this.raporForm.controls.raporTuruId.disable();
    this.sonOlusturulanRaporNo = null;
  }
}
