import { Routes } from '@angular/router';
import { RaporOlustur } from './pages/rapor-olustur/rapor-olustur';
import { RaporDetay } from './pages/rapor-detay/rapor-detay'; // YENİ

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'rapor-olustur',
    pathMatch: 'full',
  },
  {
    path: 'rapor-olustur',
    component: RaporOlustur,
  },
  {
    path: 'rapor/:id',
    component: RaporDetay,
  },
];
