import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../../_services/account/account-service';
import { switchMap, take, throwError } from 'rxjs';
import { User } from '../../_models/user';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.currentUser$.pipe(
    take(1),
    switchMap((currentUser: User | null) => {
      if (currentUser) {
        const expiry = JSON.parse(atob(currentUser.token.split('.')[1])).exp;

        if (expiry * 1000 <= Date.now()) {
          accountService.logout();
          router.navigateByUrl('/');

          return throwError(
            () =>
              new HttpErrorResponse({
                statusText: 'Token expired',
                status: 401,
              }),
          );
        }

        req = req.clone({
          setHeaders: { Authorization: `Bearer ${currentUser.token}` },
        });
      }

      return next(req);
    }),
  );
};
