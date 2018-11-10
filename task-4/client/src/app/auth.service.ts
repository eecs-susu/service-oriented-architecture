import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private api: ApiService) { }

  login(loginData: { username: string, password: string }, onSuccess, onError) {
    return this.api.request_token(loginData).subscribe((data) => {
      localStorage.setItem('access_token', data['token']);
      this.api.get('/user/', { headers: new HttpHeaders().set('Authorization', 'Token ' + this.accessToken) }).subscribe((userData) => {
        localStorage.setItem('email', userData['email']);
      });
      onSuccess();
    }, e => onError(e));
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
  }

  public get isAuthorized(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  get accessToken() {
    return localStorage.getItem('access_token');
  }

  get email() {
    return localStorage.getItem('email');
  }
}
