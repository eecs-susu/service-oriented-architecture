import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly ServerAddress = 'http://django-env.bj8uims4hy.eu-central-1.elasticbeanstalk.com';
  constructor(private http: HttpClient) { }

  post(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }) {
    if (url.startsWith('/')) {
      url = this.ServerAddress + url;
    }
    return this.http.post(url, body, options);
  }

  get(url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }) {
    if (url.startsWith('/')) {
      url = this.ServerAddress + url;
    }
    return this.http.get(url, options);
  }

  patch(url: string, body: any | null, options: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }) {
    if (url.startsWith('/')) {
      url = this.ServerAddress + url;
    }
    return this.http.patch(url, body, options);
  }

  request_token(loginData: { username: string, password: string }) {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post(this.ServerAddress + '/api-token-auth/', {
      username: loginData.username,
      password: loginData.password,
    }, options);
  }
}
