import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './_interceptors/error/error-interceptor';
import { jwtInterceptor } from './_interceptors/jwt/jwt-interceptor';
import { loadingInterceptor } from './_interceptors/loading/loading-interceptor';
import { provideTimeago } from 'ngx-timeago';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        jwtInterceptor,
        loadingInterceptor
      ])
    ),
    provideAnimationsAsync(),
    provideToastr({
      positionClass: 'toast-bottom-right'
    }),

    provideTimeago()
  ]
};
