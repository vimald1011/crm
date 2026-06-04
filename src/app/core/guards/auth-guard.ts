import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { Storage } from '../services/storage';

export const authGuard: CanActivateFn = () => {

  const storage = inject(Storage);

  const router = inject(Router);

  if (storage.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);

  return false;
};