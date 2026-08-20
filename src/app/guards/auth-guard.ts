import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';

// CanActivateFn: Angular Router'a "bu route'a girilmeden ÖNCE bu kontrolü çalıştır,
// true dönerse izin ver, false dönerse engelle" dedirten bir fonksiyon.
// inject(...): constructor injection'ın fonksiyon içindeki karşılığı — burada
// bir class/component olmadığı için (sadece bir fonksiyon), constructor'a
// enjekte edemiyoruz, bunun yerine inject() ile aynı sonucu alıyoruz.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};
