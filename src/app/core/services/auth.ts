import {
  Injectable,
  inject,
  signal
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import {
  LoginRequest,
  SignupRequest,
  AuthResponse
} from '../models/user.model';

import { Storage } from './storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(Storage);

  private apiUrl =
  `${environment.apiBaseUrl}/auth`;

  isAuthenticated = signal(false);

  constructor() {

    this.isAuthenticated.set(
      this.storage.isLoggedIn()
    );

  }

  signup(
    user: SignupRequest,
    callback?: () => void
  ) {

    this.http.post(
      `${this.apiUrl}/signup`,
      user
    ).subscribe({

      next: () => {

        if (callback) {
          callback();
        }

      },

      error: (error) => {
        console.error(
          'Signup failed:',
          error
        );
      }

    });

  }

  login(
    user: LoginRequest,
    callback?: () => void
  ) {

    this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      user
    ).subscribe({

      next: (response) => {

        this.storage.saveToken(
          response.access_token
        );

        this.isAuthenticated.set(
          true
        );

        if (callback) {
          callback();
        }

      },

      error: (error) => {

        console.error(
          'Login failed:',
          error
        );

      }

    });

  }

  logout() {

  this.storage.removeToken();

  this.isAuthenticated.set(false);

  this.router.navigate([
    '/login'
  ]);

}

}