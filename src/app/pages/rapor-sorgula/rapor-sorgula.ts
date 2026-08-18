import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { RaporService } from '../../services/rapor';
import { ReferansService } from '../../services/referans';
import { RaporResponse } from '../../models/rapor';
import { AnaRaporTuruResponse, RaporTuruResponse } from '../../models/referans';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-rapor-sorgula',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    TableModule,
    TagModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './rapor-sorgula.html',
  styleUrl: './rapor-sorgula.scss',
})
export class RaporSorgula implements OnInit {
  anaRaporTurleri: AnaRaporTuruResponse[] = [];
  raporTurleri: RaporTuruResponse[] = [];

  durumSecenekleri = [
    { label: 'KAYITLI', value: 'KAYITLI' },
    { label: 'CEVAPLANDI', value: 'CEVAPLANDI' },
    { label: 'TAHAKKUK_KESILDI', value: 'TAHAKKUK_KESILDI' },
    { label: 'IPTAL', value: 'IPTAL' },
  ];

  sorguForm = new FormGroup({
    raporKayitNo: new FormControl(''),
    vergiKimlikNo: new FormControl(''),
    tcKimlikNo: new FormControl(''),
    durum: new FormControl<string | null>(null),
    anaRaporTuruId: new FormControl<string | null>(null),
    raporTuruId: new FormControl<string | null>({ value: null, disabled: true }),
    tarihAraligi: new FormControl<Date[] | null>(null),
  });

  raporlar: RaporResponse[] = [];
  seciliRapor: RaporResponse | null = null;
  toplamKayit = 0;
  sayfaBoyutu = 10;
  yukleniyor = false;

  constructor(
    private router: Router,
    private raporService: RaporService,
    private referansService: ReferansService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Sadece dropdown verilerini çekiyoruz.
    // Tablo [lazy]="true" olduğu için ilk veriyi onLazyLoad kendisi tetikler!
    this.referansService.anaRaporTurleriniGetir().subscribe((veri) => {
      this.anaRaporTurleri = veri;
      this.cdr.detectChanges();
    });
  }

  anaRaporTuruDegisti(): void {
    const anaRaporTuruId = this.sorguForm.controls.anaRaporTuruId.value;
    this.sorguForm.controls.raporTuruId.reset();
    this.raporTurleri = [];

    if (!anaRaporTuruId) {
      this.sorguForm.controls.raporTuruId.disable();
      return;
    }

    this.sorguForm.controls.raporTuruId.enable();
    this.referansService.raporTurleriniGetir(anaRaporTuruId).subscribe((veri) => {
      this.raporTurleri = veri;
      this.cdr.detectChanges();
    });
  }

  // PrimeNG TableLazyLoadEvent tipiyle eşleşen yükleme metodu
  onLazyLoad(event: TableLazyLoadEvent): void {
    const boyut = event.rows ?? 10;
    const ilkKayit = event.first ?? 0;
    const sayfa = Math.floor(ilkKayit / boyut);

    this.sayfaBoyutu = boyut;
    this.sorgula(sayfa, boyut);
  }

  sorgula(sayfa = 0, boyut = this.sayfaBoyutu): void {
    const v = this.sorguForm.value;

    const baslangic = v.tarihAraligi?.[0];
    const bitis = v.tarihAraligi?.[1];

    if (baslangic && bitis && baslangic > bitis) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Geçersiz tarih aralığı',
        detail: 'Başlangıç tarihi, bitiş tarihinden sonra olamaz.',
      });
      return;
    }

    let baslangicTarihi: string | undefined;
    let bitisTarihi: string | undefined;

    if (baslangic) {
      baslangicTarihi = this.tarihiFormatla(baslangic);
    }

    if (bitis) {
      bitisTarihi = this.tarihiFormatla(bitis);
    }

    this.yukleniyor = true;

    this.raporService
      .raporSorgula(
        {
          raporKayitNo: v.raporKayitNo?.trim() || undefined,
          vergiKimlikNo: v.vergiKimlikNo?.trim() || undefined,
          tcKimlikNo: v.tcKimlikNo?.trim() || undefined,
          durum: v.durum || undefined,
          anaRaporTuruId: v.anaRaporTuruId || undefined,
          raporTuruId: v.raporTuruId || undefined,
          baslangicTarihi,
          bitisTarihi,
        },
        sayfa,
        boyut,
      )
      .subscribe({
        next: (res) => {
          this.raporlar = res.content ?? [];
          this.toplamKayit = res.totalElements ?? 0;
          this.seciliRapor = null;
          this.yukleniyor = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: err.error?.message ?? 'Raporlar listelenirken bir hata oluştu.',
          });

          this.yukleniyor = false;
          this.cdr.detectChanges();
        },
      });
  }
  private tarihiFormatla(tarih: Date): string {
    return formatDate(tarih, 'yyyy-MM-dd', 'en-US');
  }
  temizle(): void {
    this.sorguForm.reset();
    this.sorguForm.controls.raporTuruId.disable();
    this.sorgula(0);
  }

  yeniRaporOlustur(): void {
    this.router.navigate(['/rapor-olustur']);
  }

  goruntule(): void {
    const id = this.seciliRapor?.raporId;
    if (id) {
      this.router.navigate(['/rapor', id]);
    }
  }

  get guncelleAktif(): boolean {
    return this.seciliRapor?.durum === 'KAYITLI';
  }

  get cevapKaydetAktif(): boolean {
    return this.seciliRapor?.durum === 'KAYITLI';
  }

  get tahakkukKesAktif(): boolean {
    return this.seciliRapor?.durum === 'KAYITLI';
  }

  get iptalEtAktif(): boolean {
    return this.seciliRapor?.durum === 'KAYITLI';
  }

  guncelle(): void {
    const id = this.seciliRapor?.raporId;
    if (id) {
      this.router.navigate(['/rapor-guncelle', id]);
    }
  }

  cevapKaydet(): void {
    const id = this.seciliRapor?.raporId;
    if (id) {
      this.router.navigate(['/cevap-kayit', id]);
    }
  }

  iptalEt(): void {
    const id = this.seciliRapor?.raporId;
    if (!this.seciliRapor || !id) return;

    if (
      confirm(
        `'${this.seciliRapor.raporKayitNo}' numaralı rapor iptal edilecek. Onaylıyor musunuz?`,
      )
    ) {
      this.raporService.iptalEt(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Rapor iptal edildi.',
          });
          this.sorgula(0);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: err.error?.message ?? 'İptal edilemedi.',
          });
        },
      });
    }
  }

  tahakkukKes(): void {
    const id = this.seciliRapor?.raporId;
    if (!this.seciliRapor || !id) return;

    if (
      confirm(
        `'${this.seciliRapor.raporKayitNo}' numaralı rapora tahakkuk kesilecek. Onaylıyor musunuz?`,
      )
    ) {
      this.raporService.tahakkukKes(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Tahakkuk kesildi.',
          });
          this.sorgula(0);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: err.error?.message ?? 'Tahakkuk kesilemedi.',
          });
        },
      });
    }
  }
}
