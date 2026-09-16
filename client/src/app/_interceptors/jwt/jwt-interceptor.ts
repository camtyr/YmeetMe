import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../../_services/account/account-service';
import { switchMap, take } from 'rxjs';
import { User } from '../../_models/user';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  return accountService.currentUser$.pipe(
    take(1),
    switchMap((currentUser: User | null) => {
      if (currentUser) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${currentUser.token}` }
        });
      }
      return next(req);
    })
  );
};
