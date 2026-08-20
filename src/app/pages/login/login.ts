import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  hataMesaji: string | null = null;

  loginForm = new FormGroup({
    kullaniciAdi: new FormControl('', { nonNullable: true, validators: Validators.required }),
    sifre: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  girisYap(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { kullaniciAdi, sifre } = this.loginForm.getRawValue();
    const basarili = this.authService.girisYap(kullaniciAdi, sifre);

    if (basarili) {
      this.hataMesaji = null;
      this.router.navigateByUrl('/rapor-sorgula');
    } else {
      this.hataMesaji = 'Kullanıcı adı veya şifre hatalı.';
    }
  }
}
