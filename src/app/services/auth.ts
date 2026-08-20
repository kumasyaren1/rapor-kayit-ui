import { Injectable, signal } from '@angular/core';

// Doküman: "basit bir login ekranı/JWT ile simüle edilebilir" diyor —
// bu yüzden gerçek bir backend kimlik doğrulaması KURMUYORUZ, sabit
// bir kullanıcı adı/şifre ile "giriş yapılmış gibi" davranıyoruz.
const SABIT_KULLANICI_ADI = 'vd.kullanicisi';
const SABIT_SIFRE = '1234';

const STORAGE_KEY = 'girisYapildi';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // signal: Angular'ın modern "reaktif değişken" mekanizması. Normal bir
  // property gibi düşünebilirsin, farkı: değeri değiştiğinde ona bağlı
  // her yer (örn. template) otomatik güncellenir — subscribe/ChangeDetectorRef
  // ile uğraşmana gerek kalmaz.
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
