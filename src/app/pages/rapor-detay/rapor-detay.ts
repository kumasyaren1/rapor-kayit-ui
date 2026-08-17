import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

import { RaporService } from '../../services/rapor';
import { RaporResponse } from '../../models/rapor';

@Component({
  selector: 'app-rapor-detay',
  imports: [RouterLink, DatePipe, InputTextModule, TagModule, ButtonModule],
  templateUrl: './rapor-detay.html',
  styleUrl: './rapor-detay.scss',
})
export class RaporDetay implements OnInit {
  rapor: RaporResponse | null = null;
  hataMesaji: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private raporService: RaporService,
    private cdr: ChangeDetectorRef, // YENİ
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.hataMesaji = 'Geçersiz rapor adresi.';
      return;
    }

    this.raporService.raporGetir(id).subscribe({
      next: (rapor) => {
        this.rapor = rapor;
        this.cdr.detectChanges(); // YENİ — Angular'a "şimdi ekranı güncelle" diyoruz
      },
      error: () => {
        this.hataMesaji = 'Rapor bulunamadı.';
        this.cdr.detectChanges(); // YENİ
      },
    });
  }
}
