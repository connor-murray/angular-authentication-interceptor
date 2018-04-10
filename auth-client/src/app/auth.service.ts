import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {catchError, tap} from 'rxjs/operators';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {

  public currentToken: string;
  private serverURL = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
  }

  login(): void {
    console.log('login');
    this.currentToken = 'auth_token';
  }

  logout(): void {
    console.log('logout');
  }

  getToken(): string {
    return this.currentToken;
  }

  refreshToken(): Observable<string> {
    console.log('attempting to refresh token');
    return this.httpClient.get<any>(`${this.serverURL}/refresh`).pipe(
      tap((response: any) => {
        console.log('refresh token updated');
        this.currentToken = response.access_token;
      }),
      catchError(error => Observable.throw(error.status))
    );
  }

  getTodos(): Observable<any> {
    console.log('retrieving todos');
    return this.httpClient.get<any>(`${this.serverURL}/todos`).pipe(
      tap(() => {
        console.log('todos returned successfully');
      }),
      catchError(error => Observable.throw(error.status))
    );
  }

  get401(): Observable<any> {
    return this.httpClient.get<any>(`${this.serverURL}/fail`).pipe(
      catchError(error => Observable.throw(error.status))
    );
  }
}
