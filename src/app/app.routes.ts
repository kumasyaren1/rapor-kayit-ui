import { Routes } from '@angular/router';
import { RaporSorgula } from './pages/rapor-sorgula/rapor-sorgula';
import { RaporOlustur } from './pages/rapor-olustur/rapor-olustur';
import { RaporGuncelle } from './pages/rapor-guncelle/rapor-guncelle';
import { CevapKayit } from './pages/cevap-kayit/cevap-kayit';
import { RaporDetay } from './pages/rapor-detay/rapor-detay';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'rapor-sorgula',
    pathMatch: 'full',
  },
  {
    path: 'rapor-sorgula',
    component: RaporSorgula,
  },
  {
    path: 'rapor-olustur',
    component: RaporOlustur,
  },
  {
    path: 'rapor/:id',
    component: RaporDetay,
  },
  { path: 'rapor-guncelle/:id',
    component: RaporGuncelle
  },
  { path: 'cevap-kayit/:id',
    component: CevapKayit
  },
];
