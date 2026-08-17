import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { RaporService } from '../../services/rapor';
import { RaporResponse } from '../../models/rapor';

@Component({
  selector: 'app-rapor-detay',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './rapor-detay.html',
  styleUrl: './rapor-detay.scss',
})
export class RaporDetay implements OnInit {
  raporId!: string;
  rapor: RaporResponse | null = null;
  hataMesaji: string | null = null;
  yukleniyor = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private raporService: RaporService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.raporId = this.route.snapshot.paramMap.get('id')!;
    if (!this.raporId) {
      this.hataMesaji = 'Geçersiz rapor adresi';
      return;
    }
    this.raporuYukle();
  }

  private raporuYukle(): void {
    this.yukleniyor = true;
    this.raporService.raporGetir(this.raporId).subscribe({
      next: (res) => {
        this.rapor = res;
        this.yukleniyor = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.hataMesaji = 'Rapor bulunamadı.';
        this.yukleniyor = false;
        this.cdr.detectChanges();
      },
    });
  }

  don(): void {
    this.router.navigate(['/rapor-sorgula']);
  }
}
