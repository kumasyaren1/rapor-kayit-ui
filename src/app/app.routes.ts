import { Routes } from '@angular/router';
import { RaporOlustur } from './pages/rapor-olustur/rapor-olustur'; //Oluşturduğumuz component’i bu dosyada kullanabilmemizi sağlar.

export const routes: Routes = [
  {
    path: '', //Kullanıcı doğrudan localhost:4200 adresine girdiğinde çalışır.
    redirectTo: 'rapor-olustur', //Kullanıcıyı otomatik olarak /rapor-olustur adresine gönderir.
    pathMatch: 'full' //URL yolunun tamamı boşsa bu route’u çalıştır.
  },
  {
    path: 'rapor-olustur', //Tarayıcıdaki URL yoludur
    component: RaporOlustur //Bu adrese gidildiğinde hangi component’in ekranda gösterileceğini belirtir.
  }
];
