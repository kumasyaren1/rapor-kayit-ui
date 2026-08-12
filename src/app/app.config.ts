import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

const RaporKayitPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff4f8',
      100: '#d9e5ee',
      200: '#b7ccdd',
      300: '#8cabc4',
      400: '#5d85a8',
      500: '#23466f',
      600: '#1f3f64',
      700: '#1a3555',
      800: '#162c47',
      900: '#12243a',
      950: '#0b1726'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    providePrimeNG({
      theme: {
        preset: RaporKayitPreset
      }
    })
  ]
};
