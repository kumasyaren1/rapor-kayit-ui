import { Routes } from '@angular/router';
import { RaporSorgula } from './pages/rapor-sorgula/rapor-sorgula';
import { RaporOlustur } from './pages/rapor-olustur/rapor-olustur';
import { RaporGuncelle } from './pages/rapor-guncelle/rapor-guncelle';
import { CevapKayit } from './pages/cevap-kayit/cevap-kayit';
import { RaporDetay } from './pages/rapor-detay/rapor-detay';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'rapor-sorgula',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'rapor-sorgula',
    component: RaporSorgula,
    canActivate: [authGuard],
  },
  {
    path: 'rapor-olustur',
    component: RaporOlustur,
    canActivate: [authGuard],
  },
  {
    path: 'rapor/:id',
    component: RaporDetay,
    canActivate: [authGuard],
  },
  {
    path: 'rapor-guncelle/:id',
    component: RaporGuncelle,
    canActivate: [authGuard],
  },
  {
    path: 'cevap-kayit/:id',
    component: CevapKayit,
    canActivate: [authGuard],
  },
];
