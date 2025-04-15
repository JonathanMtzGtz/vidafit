import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth: Auth = inject(Auth);
  const router: Router = inject(Router);
  
  return user(auth).pipe(
    map(user => {
      if (user) {
        return true;
      }
      return router.parseUrl('/login');
    })
  );
};
