import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router){}

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser( email: string, password: string ) {
    const authData: AuthData = { email: email, password: password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
      this.router.navigateByUrl('/');
    }, error => {
      this.authStatusListener.next(false);
    });
  }
  login( email: string, password: string ) {
    const authData: AuthData = { email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        console.log(response);
        const expiresIn = response.expiresIn;
        this.serAuthTimer(expiresIn)
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigateByUrl('/');
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const AuthInformation = this.getAuthData();
    if(!AuthInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = AuthInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = AuthInformation.token;
      this.isAuthenticated = true;
      this.userId = AuthInformation.userId;
      this.serAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigateByUrl('/');
  }
  private serAuthTimer(duration: number) {
    console.log('Timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
