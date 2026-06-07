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

        localStorage.removeItem('token');

        console.warn(
          'Session expired. Redirecting to login.'
        );

        router.navigate([
          '/login'
        ]);
      }

      if (error.status === 0) {

        console.error(
          'Unable to connect to backend server.'
        );
      }

      if (error.status >= 500) {

        console.error(
          'Server error occurred.'
        );
      }

      return throwError(
        () => error
      );

    })

  );

};