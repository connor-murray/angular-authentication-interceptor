import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthService} from './auth.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {catchError, filter, finalize, switchMap, take} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  tokenSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(this.addTokenHeader(req))
      .pipe(
        catchError(error => {
          return this.handleHttpError(req, next, error);
        })
      );
  }

  private queueRequest(req: HttpRequest<any>, next: HttpHandler): any {
    return this.tokenSubject$.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => next.handle(this.addTokenHeader(req)))
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler, error: any) {
    if (this.isAuthenticatedRequest(req)) {
      return (!this.isRefreshingToken) ? this.refreshToken(req, next) : this.queueRequest(req, next);
    } else {
      this.throwError(error);
    }
  }

  private handle400(req: HttpRequest<any>, error: any) {
    return this.isAuthenticatedRequest(req) ? this.logout(error) : this.throwError(error);
  }

  private addTokenHeader(req: HttpRequest<any>): HttpRequest<any> {
    return this.isAuthenticatedRequest(req) ? req.clone({setHeaders: {'Authorization': 'Bearer ' + this.authService.getToken()}}) : req;
  }

  private isAuthenticatedRequest(req: HttpRequest<any>) {
    const checks: boolean[] = [
      req.url.endsWith('/oauth/token'),
      req.url.startsWith('/assets')
    ];
    return checks.every(urlCheck => urlCheck === false);
  }

  private logout(error: any): Observable<any> {
    this.authService.logout();
    return this.throwError(error);
  }

  private throwError(error: any): Observable<ErrorObservable> {
    return Observable.throw(error);
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.isRefreshingToken = true;
    this.tokenSubject$.next(null);

    return this.authService.refreshToken()
      .pipe(
        switchMap((newToken: any) => {
          this.tokenSubject$.next(newToken);
          return next.handle(this.addTokenHeader(req));
        }),
        catchError(error => this.logout(error)),
        finalize(() => this.isRefreshingToken = false)
      );
  }

  private handleHttpError(req: HttpRequest<any>, next: HttpHandler, error: any): Observable<any> {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          return this.handle400(req, error);
        case 401:
          return this.handle401(req, next, error);
        default:
          return this.throwError(error);
      }
    } else {
      return this.throwError(error);
    }
  }
}
