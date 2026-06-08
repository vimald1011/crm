import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { LoginRequest, SignupRequest, AuthResponse, CurrentUser } from '../models/user.model';
import { Storage } from './storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(Storage);

  private apiUrl = `${environment.apiBaseUrl}/auth`;

  isAuthenticated = signal(false);

  currentUser = signal<CurrentUser | null>(null);

  constructor() {
    const loggedIn = this.storage.isLoggedIn();

    this.isAuthenticated.set(loggedIn);

    if (!loggedIn) {
      this.storage.clearSession();

      return;
    }

    this.getCurrentUser().subscribe({
      error: () => {
        this.logout();
      },
    });
  }

  signup(user: SignupRequest, callback?: () => void) {
    this.http.post(`${this.apiUrl}/signup`, user).subscribe({
      next: () => {
        if (callback) {
          callback();
        }
      },

      error: (error) => {
        console.error('Signup failed:', error);
      },
    });
  }

  login(user: LoginRequest, successCallback?: () => void, errorCallback?: () => void) {
    this.http.post<AuthResponse>(`${this.apiUrl}/login`, user).subscribe({
      next: (response) => {
        this.storage.saveToken(response.access_token);

        this.isAuthenticated.set(true);

        this.getCurrentUser().subscribe({
          next: () => {
            if (successCallback) {
              successCallback();
            }
          },

          error: (error) => {
            console.error('Login failed:', error);

            if (errorCallback) {
              errorCallback();
            }
          },
        });
      },

      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  getCurrentUser() {
    return this.http.get<CurrentUser>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
      }),
    );
  }

  logout() {
    this.storage.removeToken();

    this.isAuthenticated.set(false);

    this.router.navigate(['/login']);
  }
}
