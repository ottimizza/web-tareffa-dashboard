import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { SKIP_INTERCEPTOR } from '../skip-interceptor';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { AuthSession } from '@shared/models/AuthSession';

export const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403
};

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {
  private refreshTokenEmProgresso = false;

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const groupId: string = this.id();

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (request.headers.has(SKIP_INTERCEPTOR)) {
          return throwError(error);
        }

        if (error.error instanceof Error) {
        } else {
          if (error.status === HttpStatus.BAD_REQUEST) {
            if (this.requestMatchesCallbackURL(request)) {
              this.logout();
              return throwError(error);
            }
          }

          if (error.status === HttpStatus.UNAUTHORIZED) {
            if (this.requestMatchesCallbackURL(request)) {
              this.logout();
              return throwError(error);
            }

            if (this.refreshTokenEmProgresso) {
              this.log('Waiting Refresh...', request, error, groupId);
              return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((response: any) =>
                  next.handle(this.addAuthenticationToken(request, response.access_token))
                )
              );
            } else {
              this.refreshTokenEmProgresso = true;

              this.refreshTokenSubject.next(null);
              return this.authenticationService
                .refresh(AuthSession.fromLocalStorage().getAuthenticated().refreshToken)
                .pipe(
                  switchMap((response: any) => {
                    this.refreshTokenEmProgresso = false;
                    this.refreshTokenSubject.next(response);

                    AuthSession.fromOAuthResponse(response)
                      .store()
                      .then(async () => {
                        const storeUserInfo = this.authenticationService.storeUserInfo(true);
                        const storeTokenInfo = this.authenticationService.storeTokenInfo(true);
                      });

                    return next.handle(this.addAuthenticationToken(request, response.access_token));
                  }),
                  catchError((err: any) => {
                    this.refreshTokenEmProgresso = false;

                    this.logout();
                    return throwError(err);
                  })
                );
            }

            // return throwError(error);
          }
        }
        return throwError(error);
      })
    ) as Observable<HttpEvent<any>>;
  }

  log(message: string, request: HttpRequest<any>, error: HttpErrorResponse, groupId = null) {
    const cn = GlobalHttpInterceptor.name;
    const ts = new Date().toISOString();
    const status = error.status;
    const url = request.url;

    if (groupId) {
      console.log(`${groupId} [${cn}] [${ts}] [${status} - ${url}]: ${message}`);
    } else {
      console.log(`[${cn}] [${ts}] [${status} - ${url}]: ${message}`);
    }
  }

  addAuthenticationToken(request, refreshToken?: string) {
    const accessToken =
      refreshToken || AuthSession.fromLocalStorage().getAuthenticated().accessToken;

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
        'X-Skip-Interceptor': ''
      }
    });
  }

  private requestMatchesCallbackURL(request: HttpRequest<any>): boolean {
    return request.url.includes(AuthenticationService.CALLBACK_URL);
  }

  private logout() {
    this.authenticationService.clearStorage();
    this.authenticationService.authorize();
  }

  private id() {
    let state = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
      state += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return state;
  }
}
