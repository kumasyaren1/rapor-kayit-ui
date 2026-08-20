import { Injectable, signal } from '@angular/core';

const SABIT_KULLANICI_ADI = 'vd.kullanicisi';
const SABIT_SIFRE = '1234';

const STORAGE_KEY = 'girisYapildi';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = signal<boolean>(this.oturumVarMi());

  private oturumVarMi(): boolean {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  }

  girisYap(kullaniciAdi: string, sifre: string): boolean {
    const basarili = kullaniciAdi === SABIT_KULLANICI_ADI && sifre === SABIT_SIFRE;

    if (basarili) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      this.isLoggedIn.set(true);
    }

    return basarili;
  }

  cikisYap(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.isLoggedIn.set(false);
  }
}
