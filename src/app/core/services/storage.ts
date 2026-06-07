import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Storage {

  private TOKEN_KEY = 'token';

  saveToken(token: string) {

    localStorage.setItem(
      this.TOKEN_KEY,
      token
    );

  }

  getToken(): string | null {

    return localStorage.getItem(
      this.TOKEN_KEY
    );

  }

  removeToken() {

    localStorage.removeItem(
      this.TOKEN_KEY
    );

  }

  clearSession() {

    localStorage.removeItem(
      this.TOKEN_KEY
    );

  }

  isTokenExpired(): boolean {

    const token = this.getToken();

    if (!token) {
      return true;
    }

    try {

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      const currentTime =
        Math.floor(Date.now() / 1000);

      return payload.exp < currentTime;

    } catch {

      return true;

    }

  }

  isLoggedIn(): boolean {

    const token = this.getToken();

    if (!token) {
      return false;
    }

    return !this.isTokenExpired();

  }

}