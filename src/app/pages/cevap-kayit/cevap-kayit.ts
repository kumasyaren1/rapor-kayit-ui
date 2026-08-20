import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { RaporService } from '../../services/rapor';
import { RaporResponse } from '../../models/rapor';

@Component({
  selector: 'app-cevap-kayit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './cevap-kayit.html',
  styleUrl: './cevap-kayit.scss',
})
export class CevapKayit implements OnInit {
  form!: FormGroup;
  raporId!: string;
  rapor: RaporResponse | null = null;

  kaydediliyor = false;

  bugun: Date = new Date();
  enErkenCevapTarihi: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private raporService: RaporService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.raporId = this.route.snapshot.paramMap.get('id')!;
    this.formOlustur();
    this.raporuYukle();
  }

  private formOlustur(): void {
    this.form = this.fb.group({
      vergiKimlikNo: [{ value: '', disabled: true }],
      tcKimlikNo: [{ value: '', disabled: true }],
      adSoyadUnvan: [{ value: '', disabled: true }],
      vergiKoduAdi: [{ value: '', disabled: true }],
      anaRaporTuruAdi: [{ value: '', disabled: true }],
      raporTuruAdi: [{ value: '', disabled: true }],
      duzenlemeTarihi: [{ value: '', disabled: true }],

      cevapNumarasi: ['', Validators.required],
      cevapTarihi: [new Date(), Validators.required],
      cevapSonucu: ['', Validators.required],
    });
  }

  private raporuYukle(): void {
    this.raporService.raporGetir(this.raporId).subscribe({
      next: (res) => {
        this.rapor = res;

        this.enErkenCevapTarihi = this.metindenYerelTarihOlustur(res.duzenlemeTarihi);

        this.form.patchValue({
          vergiKimlikNo: res.vergiKimlikNo || '-',
          tcKimlikNo: res.tcKimlikNo || '-',
          adSoyadUnvan: res.adSoyadUnvan,
          vergiKoduAdi: res.vergiKoduAdi || res.vergiKodu,
          anaRaporTuruAdi: res.anaRaporTuruAdi,
          raporTuruAdi: res.raporTuruAdi,
          duzenlemeTarihi: res.duzenlemeTarihi,
        });
      },
      error: () => {
        this.hataGoster('Rapor bilgileri alınamadı.');
      },
    });
  }

  kaydet(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Eksik bilgi',
        detail: 'Lütfen zorunlu alanları doldurun.',
      });

      return;
    }

    const { cevapNumarasi, cevapTarihi, cevapSonucu } = this.form.getRawValue();

    const formatliTarih = this.tarihiFormatla(cevapTarihi);
    if (!confirm('Cevap kaydedilecek. Onaylıyor musunuz?')) {
      return;
    }
    this.kaydediliyor = true;

    this.raporService
      .cevapKaydet(this.raporId, {
        cevapNumarasi: cevapNumarasi.trim(),
        cevapTarihi: formatliTarih,
        cevapSonucu: cevapSonucu.trim(),
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Cevap kaydı başarıyla tamamlandı.',
          });

          setTimeout(() => this.router.navigate(['/rapor-sorgula']), 1000);
        },
        error: (err) => {
          this.hataGoster(err.error?.message ?? 'Cevap kaydı sırasında hata oluştu.');

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

  private metindenYerelTarihOlustur(tarih: string): Date {
    const [yil, ay, gun] = tarih.split('-').map(Number);
    return new Date(yil, ay - 1, gun);
  }

  private hataGoster(mesaj: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Hata',
      detail: mesaj,
    });
  }
}
