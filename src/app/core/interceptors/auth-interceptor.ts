import { inject } from '@angular/core';

import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { Router } from '@angular/router';

import { catchError } from 'rxjs/operators';

import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const router = inject(Router);

  const token = localStorage.getItem(
    'token'
  );

  const clonedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(clonedRequest).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        localStorage.removeItem(
          'token'
        );

        router.navigate([
          '/login'
        ]);

      }

      return throwError(
        () => error
      );

    })

  );

};