import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { Storage } from '../services/storage';

export const guestGuard: CanActivateFn = () => {

  const storage = inject(Storage);

  const router = inject(Router);

  if (!storage.isLoggedIn()) {
    return true;
  }

  router.navigate([
    '/dashboard'
  ]);

  return false;
};