import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { RaporService } from '../../services/rapor';
import { ReferansService } from '../../services/referans';
import { SicilService } from '../../services/sicil';
import { AnaRaporTuruResponse, RaporTuruResponse, VergiKoduResponse } from '../../models/referans';
import { MukellefResponse } from '../../models/mukellef-response';

@Component({
  selector: 'app-rapor-olustur',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './rapor-olustur.html',
  styleUrl: './rapor-olustur.scss',
})
export class RaporOlustur implements OnInit {
  form!: FormGroup;

  anaRaporTurleri: AnaRaporTuruResponse[] = [];
  raporTurleri: RaporTuruResponse[] = [];
  vergiKodlari: VergiKoduResponse[] = [];

  mukellefBilgisi: MukellefResponse | null = null;

  yukleniyor = false;
  kaydediliyor = false;

  raporId: string | null = null;
  duzenlemeModu = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private raporService: RaporService,
    private referansService: ReferansService,
    private sicilService: SicilService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.formOlustur();
    this.referansVerileriniYukle();

    this.raporId = this.route.snapshot.paramMap.get('id');

    if (this.raporId) {
      this.duzenlemeModu = true;
      this.raporDetayiniYukle(this.raporId);
    }
  }

  private formOlustur(): void {
    this.form = this.fb.group({
      vergiKimlikNo: [''],
      tcKimlikNo: [''],
      adSoyadUnvan: [{ value: '', disabled: true }],
      anaRaporTuruId: [null, Validators.required],
      raporTuruId: [{ value: null, disabled: true }, Validators.required],
      vergiKoduId: [null, Validators.required],
      duzenlemeTarihi: [new Date(), Validators.required],
      aciklama: [''],
    });
  }

  private referansVerileriniYukle(): void {
    this.referansService.anaRaporTurleriniGetir().subscribe({
      next: (data) => {
        this.anaRaporTurleri = data;
      },
      error: () => {
        this.hataGoster('Ana rapor türleri yüklenemedi.');
      },
    });

    this.referansService.vergiKodlariniGetir().subscribe({
      next: (data) => {
        this.vergiKodlari = data;
      },
      error: () => {
        this.hataGoster('Vergi kodları yüklenemedi.');
      },
    });
  }

  anaRaporTuruDegisti(): void {
    const anaRaporTuruId = this.form.get('anaRaporTuruId')?.value;

    const raporTuruControl = this.form.get('raporTuruId');

    raporTuruControl?.reset();
    this.raporTurleri = [];

    if (!anaRaporTuruId) {
      raporTuruControl?.disable();
      return;
    }

    raporTuruControl?.enable();

    this.referansService.raporTurleriniGetir(anaRaporTuruId).subscribe({
      next: (data) => {
        this.raporTurleri = data;
      },
      error: () => {
        raporTuruControl?.disable();
        this.hataGoster('Rapor türleri yüklenemedi.');
      },
    });
  }

  mukellefSorgula(): void {
    const vkn = this.form.get('vergiKimlikNo')?.value?.trim();

    const tckn = this.form.get('tcKimlikNo')?.value?.trim();

    if (!vkn && !tckn) {
      this.hataGoster('Lütfen VKN veya TCKN giriniz.');
      return;
    }

    this.yukleniyor = true;

    this.sicilService.mukellefSorgula(vkn, tckn).subscribe({
      next: (mukellef) => {
        this.mukellefBilgisi = mukellef;

        this.form.patchValue({
          adSoyadUnvan: mukellef.adSoyadUnvan,
          vergiKimlikNo: mukellef.vergiKimlikNo,
          tcKimlikNo: mukellef.tcKimlikNo,
        });

        this.yukleniyor = false;
      },
      error: (err) => {
        this.mukellefBilgisi = null;

        this.form.patchValue({
          adSoyadUnvan: '',
        });

        this.hataGoster(err.error?.message ?? 'Mükellef bulunamadı.');

        this.yukleniyor = false;
      },
    });
  }

  private raporDetayiniYukle(id: string): void {
    this.yukleniyor = true;

    this.raporService.raporGetir(id).subscribe({
      next: (rapor) => {
        this.form.patchValue({
          vergiKimlikNo: rapor.vergiKimlikNo,
          tcKimlikNo: rapor.tcKimlikNo,
          adSoyadUnvan: rapor.adSoyadUnvan,
          anaRaporTuruId: rapor.anaRaporTuruId,
          vergiKoduId: rapor.vergiKoduId,
          duzenlemeTarihi: new Date(rapor.duzenlemeTarihi),
          aciklama: rapor.aciklama,
        });

        if (rapor.anaRaporTuruId) {
          const raporTuruControl = this.form.get('raporTuruId');

          raporTuruControl?.enable();

          this.referansService.raporTurleriniGetir(rapor.anaRaporTuruId).subscribe({
            next: (turler) => {
              this.raporTurleri = turler;

              raporTuruControl?.setValue(rapor.raporTuruId);
            },
            error: () => {
              raporTuruControl?.disable();
              this.hataGoster('Rapor türleri yüklenemedi.');
            },
          });
        }

        this.yukleniyor = false;
      },
      error: () => {
        this.hataGoster('Rapor detayları yüklenemedi.');

        this.yukleniyor = false;
      },
    });
  }

  kaydet(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.hataGoster('Lütfen zorunlu alanları eksiksiz doldurunuz.');

      return;
    }

    const val = this.form.getRawValue();

    const duzenlemeTarihi = this.tarihiFormatla(val.duzenlemeTarihi);

    const requestPayload = {
      vergiKimlikNo: val.vergiKimlikNo?.trim() || undefined,

      tcKimlikNo: val.tcKimlikNo?.trim() || undefined,

      anaRaporTuruId: val.anaRaporTuruId,
      raporTuruId: val.raporTuruId,
      vergiKoduId: val.vergiKoduId,
      duzenlemeTarihi,
      aciklama: val.aciklama?.trim() || undefined,
    };

    this.kaydediliyor = true;

    if (this.duzenlemeModu && this.raporId) {
      this.raporService.raporGuncelle(this.raporId, requestPayload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Rapor başarıyla güncellendi.',
          });

          setTimeout(() => this.router.navigate(['/rapor-sorgula']), 1000);
        },
        error: (err) => {
          this.hataGoster(err.error?.message ?? 'Güncelleme sırasında hata oluştu.');

          this.kaydediliyor = false;
        },
      });

      return;
    }

    this.raporService.raporOlustur(requestPayload).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Başarılı',
          detail: `Rapor oluşturuldu: ${res.raporKayitNo}`,
        });

        setTimeout(() => this.router.navigate(['/rapor-sorgula']), 1000);
      },
      error: (err) => {
        this.hataGoster(err.error?.message ?? 'Rapor kaydedilirken hata oluştu.');

        this.kaydediliyor = false;
      },
    });
  }

  iptal(): void {
    this.router.navigate(['/rapor-sorgula']);
  }

  private tarihiFormatla(tarih: Date | string): string {
    if (tarih instanceof Date) {
      return formatDate(tarih, 'yyyy-MM-dd', 'en-US');
    }

    return tarih;
  }

  private hataGoster(mesaj: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Hata',
      detail: mesaj,
    });
  }
}
