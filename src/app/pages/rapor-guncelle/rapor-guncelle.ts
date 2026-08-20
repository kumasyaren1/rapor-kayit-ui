import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { RaporService } from '../../services/rapor';
import { ReferansService } from '../../services/referans';
import { AnaRaporTuruResponse, RaporTuruResponse, VergiKoduResponse } from '../../models/referans';
import { RaporResponse } from '../../models/rapor';

@Component({
  selector: 'app-rapor-guncelle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './rapor-guncelle.html',
  styleUrl: './rapor-guncelle.scss',
})
export class RaporGuncelle implements OnInit {
  form!: FormGroup;
  raporId!: string;
  raporDetay: RaporResponse | null = null;

  anaRaporTurleri: AnaRaporTuruResponse[] = [];
  raporTurleri: RaporTuruResponse[] = [];
  vergiKodlari: VergiKoduResponse[] = [];

  yukleniyor = false;
  kaydediliyor = false;

  bugun: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private raporService: RaporService,
    private referansService: ReferansService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.raporId = this.route.snapshot.paramMap.get('id')!;

    this.formOlustur();
    this.referanslariYukle();
    this.raporuYukle();
  }

  private formOlustur(): void {
    this.form = this.fb.group({
      vergiKimlikNo: [{ value: '', disabled: true }],
      tcKimlikNo: [{ value: '', disabled: true }],
      adSoyadUnvan: [{ value: '', disabled: true }],
      vergiKoduId: [null, Validators.required],
      anaRaporTuruId: [null, Validators.required],
      raporTuruId: [{ value: null, disabled: true }, Validators.required],
      duzenlemeTarihi: [null, Validators.required],
      aciklama: [''],
    });
  }

  private referanslariYukle(): void {
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

  private raporuYukle(): void {
    this.yukleniyor = true;

    this.raporService.raporGetir(this.raporId).subscribe({
      next: (rapor) => {
        this.raporDetay = rapor;

        this.form.patchValue({
          vergiKimlikNo: rapor.vergiKimlikNo || '-',

          tcKimlikNo: rapor.tcKimlikNo || '-',

          adSoyadUnvan: rapor.adSoyadUnvan,

          vergiKoduId: rapor.vergiKoduId,

          anaRaporTuruId: rapor.anaRaporTuruId,

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

  anaRaporTuruDegisti(): void {
    const anaId = this.form.get('anaRaporTuruId')?.value;

    const raporTuruControl = this.form.get('raporTuruId');

    raporTuruControl?.reset();
    this.raporTurleri = [];

    if (!anaId) {
      raporTuruControl?.disable();
      return;
    }

    raporTuruControl?.enable();

    this.referansService.raporTurleriniGetir(anaId).subscribe({
      next: (turler) => {
        this.raporTurleri = turler;
      },
      error: () => {
        raporTuruControl?.disable();

        this.hataGoster('Rapor türleri yüklenemedi.');
      },
    });
  }

  guncelle(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Eksik bilgi',
        detail: 'Lütfen zorunlu alanları doldurun.',
      });

      return;
    }

    const val = this.form.getRawValue();

    const duzenlemeTarihi = this.tarihiFormatla(val.duzenlemeTarihi);

    const payload = {
      vergiKimlikNo: this.raporDetay?.vergiKimlikNo || undefined,

      tcKimlikNo: this.raporDetay?.tcKimlikNo || undefined,

      anaRaporTuruId: val.anaRaporTuruId,

      raporTuruId: val.raporTuruId,

      vergiKoduId: val.vergiKoduId,

      duzenlemeTarihi,

      aciklama: val.aciklama?.trim() || undefined,
    };
    if (!confirm('Rapor güncellenecek. Onaylıyor musunuz?')) {
      return;
    }

    this.kaydediliyor = true;

    this.raporService.raporGuncelle(this.raporId, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Başarılı',
          detail: 'Rapor güncellendi.',
        });

        setTimeout(() => this.router.navigate(['/rapor-sorgula']), 1000);
      },
      error: (err) => {
        this.hataGoster(err.error?.message ?? 'Güncelleme başarısız.');

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
