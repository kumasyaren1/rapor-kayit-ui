import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SicilService } from '../../services/sicil';

@Component({
  selector: 'app-rapor-olustur',
  imports: [
    ButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './rapor-olustur.html',
  styleUrl: './rapor-olustur.scss',
})
export class RaporOlustur {
  mukellefSorgula(): void {
    const vergiKimlikNo =
      this.raporForm.controls.vergiKimlikNo.value.trim();

    const tcKimlikNo =
      this.raporForm.controls.tcKimlikNo.value.trim();

    const vknGecerli = vergiKimlikNo.length === 10;
    const tcknGecerli = tcKimlikNo.length === 11;

    if (!vknGecerli && !tcknGecerli) {
      this.raporForm.controls.adSoyadUnvan.reset();
      return;
    }

    this.sicilService
      .mukellefSorgula(
        vknGecerli ? vergiKimlikNo : undefined,
        tcknGecerli ? tcKimlikNo : undefined
      )
      .subscribe({
        next: (mukellef) => {
          this.raporForm.controls.adSoyadUnvan.setValue(
            mukellef.adSoyadUnvan
          );
        },

        error: (hata) => {
          console.error('Mükellef sorgulanamadı:', hata);
          this.raporForm.controls.adSoyadUnvan.reset();
        }
      });
  }

  raporForm = new FormGroup({
    vergiKimlikNo: new FormControl(
      '',
      { nonNullable: true }
    ),

    tcKimlikNo: new FormControl(
      '',
      { nonNullable: true }
    ),

    adSoyadUnvan: new FormControl(
      {
        value: '',
        disabled: true
      },
      { nonNullable: true }
    )
  });

  constructor(
    private sicilService: SicilService
  ) {}
}
